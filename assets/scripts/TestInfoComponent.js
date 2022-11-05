class TestInfo extends HTMLElement {
    #shadowRoot = null;

    constructor() {
        super();
    }

    getStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            :scope {}
        `;
        return style;
    }

    getTemplate() {
        const template = document.createElement('template');
        const placeholders = {
            groupId: '${groupId}',
            testId: '${testId}',
        };
        template.innerHTML = Object.keys(placeholders).reduce((prev, current) => prev.replaceAll(placeholders[current], this.getAttribute(`data-${current}`) ?? ''), `
            <div class="test-info">
                <div class="test-group-name"><slot name="test-group-name"></slot></div>
                <div class="test-name" id="test-name_\${groupId}_test_\${testId}"><slot name="test-name"></slot></div>
                <div class="test-description"><slot name="test-description"></slot></div>
                <div class="form-group-wrapper">
                    <div class="form-group test-results" data-empty-message="O teste não foi executado">
                        <fieldset>
                            <legend class="test-results-legend" aria-labelledby="test-name_\${groupId}_test_\${testId}_label test-name_\${groupId}_test_\${testId}"><h4 id="test-name_\${groupId}_test_\${testId}_label" class="test-results-legend test-results-label">Resultado do teste</h4></legend>
                            <div class="test-results-wrapper" r_ole="radiogroup" a_ria-labelledby="test-name_\${groupId}_test_\${testId}_label test-name_\${groupId}_test_\${testId}">
                                <div class="test-result-option test-result-positive" role="presentation">
                                    <input type="radio" id="testResult_group_\${groupId}_test_\${testId}_P" name="testResult['group_\${groupId}']['test_\${testId}']" value="P" aria-labelledby="testResult_group_\${groupId}_test_\${testId}_label_P">
                                    <label id="testResult_group_\${groupId}_test_\${testId}_label_P" for="testResult_group_\${groupId}_test_\${testId}_P" role="presentation" tabindex="-1">Positivo</label>
                                </div>
                                <div class="test-result-option test-result-negative" role="presentation">
                                    <input type="radio" id="testResult_group_\${groupId}_test_\${testId}_N" name="testResult['group_\${groupId}']['test_\${testId}']" value="N" aria-labelledby="testResult_group_\${groupId}_test_\${testId}_label_N">
                                    <label id="testResult_group_\${groupId}_test_\${testId}_label_N"for="testResult_group_\${groupId}_test_\${testId}_N" role="presentation" tabindex="-1">Negativo</label>
                                </div>
                                <div class="test-result-option test-result-not-applicable" role="presentation">
                                    <input type="radio" id="testResult_group_\${groupId}_test_\${testId}_NA" name="testResult['group_\${groupId}']['test_\${testId}']" value="NA" aria-labelledby="testResult_group_\${groupId}_test_\${testId}_label_NA">
                                    <label id="testResult_group_\${groupId}_test_\${testId}_label_NA" for="testResult_group_\${groupId}_test_\${testId}_NA" role="presentation" tabindex="-1">Não aplicável</label>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
                <div class="form-group-wrapper">
                    <div class="form-group test-result-facts">
                        <div class="file-previews-input-wrapper">
                            <label class="block" for="testFacts_group_\${groupId}_test_\${testId}"><h4 class="test-results-facts-labels test-results-label" aria-labelledby="test-name_\${groupId}_test_\${testId}">Evidências</h4></label>
                            <input type="file" id="testFacts_group_\${groupId}_test_\${testId}" data-controls="testFacts_group_\${groupId}_test_\${testId}_data" multiple accept="image/*">
                            <button type="button" data-controls="testFacts_group_\${groupId}_test_\${testId}" class="test-results-facts-browse-btn no-print" hidden>Carregar imagens com as evidência</button>
                            <input type="hidden" id="testFacts_group_\${groupId}_test_\${testId}_data" name="testFacts['group_\${groupId}']['test_\${testId}']" value="">
                        </div>
                        <div class="file-previews" data-empty-message="Não foram apresentadas evidências"></div>
                    </div>
                </div>
                <div class="form-group-wrapper">
                    <div class="form-group test-result-notes">
                        <label class="block" for="testNotes_group_\${groupId}_test_\${testId}"><h4 class="test-results-notes test-results-label" aria-labelledby="test-name_\${groupId}_test_\${testId}">Notas</h4></label>
                        <textarea resizable class="block form-control no-print-if-js" data-controls="testNotes_group_\${groupId}_test_\${testId}_preview" id="testNotes_group_\${groupId}_test_\${testId}" name="testNotes['group_\${groupId}']['test_\${testId}']"></textarea>
                        <div id="testNotes_group_\${groupId}_test_\${testId}_preview" class="test-result-notes-preview no-print-if-no-js show-only-when-printing" role="presentation" data-empty-message="Não foram adicionadas notas"></div>
                    </div>
                </div>
            </div>
        `);
        return template.content;
    }

    connectedCallback() {
        if (!this.#shadowRoot) {
            this.#shadowRoot = this;
            //this.#shadowRoot = this.attachShadow({ mode: 'open' });
            //this.#shadowRoot.appendChild(this.getStyle().cloneNode(true));
            this.#shadowRoot.appendChild(this.getTemplate().cloneNode(true));
            this.enableFilePreviews();
            this.enableNotesSync();
        }
    }

    enableNotesSync() {
        document.querySelectorAll('.test-result-notes textarea[data-controls]').forEach(textarea => {
            const preview = document.getElementById(textarea.getAttribute('data-controls'));
            if (!!preview) {
                textarea.addEventListener('change', (e) => {
                    preview.innerText = e.target.value;
                });
            }
        });
    }

    enableFilePreviews() {
        this.querySelectorAll('.test-result-facts input[type="file"]').forEach(fileInput => {

            const previewContainer = fileInput.closest('.test-result-facts').querySelector('.file-previews');
            if (!previewContainer) return;

            const fileInputData = document.getElementById(fileInput.getAttribute('data-controls'));
            if (!!fileInputData) {
                fileInputData.addEventListener('change', e => {
                    try {
                        previewContainer.textContent = "";

                        const images = JSON.parse(e.currentTarget.value);
                        if (images.length > 0) {
                            images.forEach(image => {
                                const button = document.createElement("button");
                                button.classList.add('thumbnail-wrapper');
                                button.setAttribute('type', 'button');
                                button.setAttribute('title', `Ative o botão para ampliar a imagem "${image?.name}".`);
                                button.setAttribute('aria-label', button.getAttribute('title'));
                                button.innerHTML = `<img class="thumbnail" src="${image?.data}" alt="${image?.name}">`;

                                button.addEventListener('click', () => {
                                    const modal = document.createElement('modal-dialog');
                                    if (!modal) return;
                                    document.body.appendChild(modal);
                                    const content = modal.getDialog();
                                    if (!!content) {
                                        const img = document.createElement('img');
                                        Object.assign(img.style, {
                                            objectFit: 'contain',
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            transformOrigin: '0px 0px',
                                            transform: 'scale(1) translate(0px, 0px)',
                                            cursor: 'grab',
                                        });
                                        img.setAttribute('alt', `"${image?.name}".`);
                                        img.setAttribute('title', `Versão ampliada da imagem "${image?.name}". Clique fora da imagem ou pressione ESC para fechar.`);
                                        img.setAttribute('aria-label', img.getAttribute('title'));
                                        img.onload = (e) => {
                                            const {
                                                height,
                                                width,
                                            } = e.target;

                                            content.appendChild(img);
                                            modal.open();

                                            this.enableImageControls(img, modal);
                                        };
                                        img.src = image?.data;
                                    }
                                });

                                previewContainer.appendChild(button);
                            });
                        }
                    } catch (ex) {
                        console.log(ex);
                        previewContainer.innerHTML = "Erro!";
                    }
                });
            }

            fileInput.addEventListener("change", (e) => {
                const features = [
                    'File',
                    'FileReader',
                    'FileList',
                    'Blob',
                ];
                if (!features.some(feature => !(feature in window))) {
                    const files = e.target.files;
                    const imagesToSave = [];

                    previewContainer.innerHTML = "A carregar...";
                    const promises = [];
                    for (let i = 0; i < files.length; i++) {
                        if (!files[i].type.match("image")) continue;
                        promises.push(new Promise((resolve, reject) => {
                            const imageReader = new FileReader();
                            imageReader.addEventListener("load", (e) => {
                                if(!!fileInputData){
                                    imagesToSave.push({name: files[i].name, data: e.target.result});
                                }
                                resolve(e.target);
                            });
                            imageReader.onerror = reject;
                            imageReader.readAsDataURL(files[i]);
                        }));
                    }
                    Promise.all(promises).then(() => {
                        if (!!fileInputData) {
                            fileInputData.value = JSON.stringify(imagesToSave);
                            fileInputData.dispatchEvent(new Event('change'));
                        }
                    });
                }
            });
        });
    }

    enableImageControls(img, modal) {
        let panning = false,
            start = { x: 0, y: 0 };

        const getTransformation = () => {
            const style = window.getComputedStyle(img)
            const matrix = new DOMMatrixReadOnly(style.transform)
            return {
                translateX: matrix.m41,
                translateY: matrix.m42,
                scale: matrix.m22,
            }
        };

        const setTransform = (pointX, pointY, scale) => {
            if (scale < 1) {
                scale = 1;
            }
            img.style.transform = "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";
        };

        // Enable zoom on mouse wheel
        img.addEventListener('wheel', (e) => {
            const transformation = getTransformation();
            let pointX = transformation.translateX,
                pointY = transformation.translateY,
                scale = transformation.scale;

            const xs = (e.clientX - pointX) / scale,
                ys = (e.clientY - pointY) / scale,
                delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
            (delta > 0) ? (scale *= 1.1) : (scale /= 1.1);
            pointX = e.clientX - xs * scale;
            pointY = e.clientY - ys * scale;

            setTransform(pointX, pointY, scale);
        }, { passive: true });

        // Enable panning and register the initial coordinates
        img.addEventListener('mousedown', (e) => {
            e.preventDefault();
            const transformation = getTransformation();
            const pointX = transformation.translateX,
                pointY = transformation.translateY;
            start = { x: e.clientX - pointX, y: e.clientY - pointY };
            panning = true;
        });

        // Stop panning the image
        img.addEventListener('mouseup', (e) => {
            panning = false;
            e.preventDefault();
        });

        // Drag the image
        img.addEventListener('mousemove', (e) => {
            e.preventDefault();
            if (!panning) {
                return;
            }
            setTransform((e.clientX - start.x), (e.clientY - start.y), getTransformation().scale);
        });

        // On double click, center the image and restore zoom
        img.addEventListener('dblclick', (e) => {
            e.preventDefault();
            setTransform(0, 0, 1);
        });

        // Disable the default click to close the modal
        img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        // Close the modal with the right mouse click
        img.addEventListener('contextmenu', (e) => {
            if (e.button === 2) {
                e.preventDefault();
                modal.destroy();
            }
        });

        img.addEventListener('keydown', (e) => {
            if (e.defaultPrevented) return; // Do nothing if event already handled

            const keys = [
                '+',
                '-',
                'ArrowUp',
                'ArrowRight',
                'ArrowDown',
                'ArrowLeft',
            ]

            if (keys.includes(e.key)) {
                const transformation = getTransformation();
                let pointX = transformation.translateX,
                    pointY = transformation.translateY,
                    scale = transformation.scale;

                const zoomFactor = 1.1,
                    panFactor = 10;

                switch (e.key) {
                    case '+':
                        scale *= zoomFactor;
                        break;
                    case '-':
                        scale /= zoomFactor;
                        break;
                    case 'ArrowUp':
                        pointY += panFactor;
                        break;
                    case 'ArrowRight':
                        pointX += panFactor;
                        break;
                    case 'ArrowDown':
                        pointY -= panFactor;
                        break;
                    case 'ArrowLeft':
                        pointX -= panFactor;
                }

                setTransform(pointX, pointY, scale);
                e.preventDefault();
                e.stopPropagation();
            }
        });

        setTransform(0, 0, 1);
        img.setAttribute('tabindex', 0);
        requestAnimationFrame(() => {
            img.focus();
        });
    }
}

customElements.define('test-info', TestInfo);
export default TestInfo;