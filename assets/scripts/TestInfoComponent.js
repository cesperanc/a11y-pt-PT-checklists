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
            <div class="test-info" id="test-g\${groupId}-t\${testId}-wrapper">
                <div class="test-group-name"><slot name="test-group-name"></slot></div>
                <div class="test-name" id="test-name_\${groupId}_test_\${testId}"><slot name="test-name"></slot></div>
                <div class="test-description"><slot name="test-description"></slot></div>
                <div class="form-group-wrapper">
                    <div class="form-group test-results" data-empty-message="O teste não foi executado">
                        <fieldset>
                            <legend class="test-results-legend" aria-labelledby="test-name_\${groupId}_test_\${testId}_results_label test-name_\${groupId}_test_\${testId}"><h4 id="test-name_\${groupId}_test_\${testId}_results_label" class="test-results-legend test-results-label">Resultado do teste</h4></legend>
                            <div class="test-results-wrapper">
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
                            <label class="block" for="testFacts_group_\${groupId}_test_\${testId}" aria-labelledby="test-name_\${groupId}_test_\${testId}_facts_label test-name_\${groupId}_test_\${testId}"><h4 id="test-name_\${groupId}_test_\${testId}_facts_label" class="test-results-facts-labels test-results-label">Evidências</h4></label>
                            <input type="file" id="testFacts_group_\${groupId}_test_\${testId}" data-controls="testFacts_group_\${groupId}_test_\${testId}_data" multiple accept="image/*">
                            <button type="button" data-controls="testFacts_group_\${groupId}_test_\${testId}" class="test-results-facts-browse-btn no-print" hidden title="Carregar imagens com as evidências" aria-lable="Carregar imagens com as evidências">Carregar imagens</button>
                            <input type="hidden" id="testFacts_group_\${groupId}_test_\${testId}_data" name="testFacts['group_\${groupId}']['test_\${testId}']" value="">
                        </div>
                        <div class="file-previews" data-empty-message="Não foram apresentadas evidências"></div>
                    </div>
                </div>
                <div class="form-group-wrapper">
                    <div class="form-group test-result-notes">
                        <label class="block" for="testNotes_group_\${groupId}_test_\${testId}" aria-labelledby="test-name_\${groupId}_test_\${testId}_notes_label test-name_\${groupId}_test_\${testId}"><h4 id="test-name_\${groupId}_test_\${testId}_notes_label" class="test-results-notes test-results-label">Notas</h4></label>
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

            const previewContainerWrapper = fileInput.closest('.test-result-facts');
            if (!previewContainerWrapper) return;

            const previewContainer = previewContainerWrapper.querySelector('.file-previews');
            if (!previewContainer) return;

            const previewContainerTmp = document.createElement('div');

            const fileInputData = document.getElementById(fileInput.getAttribute('data-controls'));
            if (!!fileInputData) {
                fileInputData.addEventListener('change', e => {
                    try {
                        const images = JSON.parse(e.currentTarget.value);
                        if (images.length > 0) {
                            images.forEach((image, index) => {
                                if(!image) return;

                                const thumbnailWrapper = document.createElement("div");
                                thumbnailWrapper.classList.add('thumbnail-wrapper');
                                const button = document.createElement("button");
                                button.classList.add('thumbnail');
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
                                            modal.open(()=>{
                                                requestAnimationFrame(()=>{
                                                    button.focus();
                                                })
                                            });

                                            this.enableImageControls(img, modal);
                                        };
                                        img.src = image?.data;
                                    }
                                });

                                thumbnailWrapper.appendChild(button);
                                previewContainerTmp.appendChild(thumbnailWrapper);

                                const removeButton = document.createElement("button");
                                removeButton.classList.add('remove-image');
                                removeButton.setAttribute('type', 'button');
                                removeButton.setAttribute('title', `Remover a imagem "${image?.name}".`);
                                removeButton.setAttribute('aria-label', button.getAttribute('title'));
                                removeButton.innerHTML = `<svg role="presentation" width="24" height="24" version='1.1' viewBox='0 0 122 122' xmlns='http://www.w3.org/2000/svg'><path d='m5.5643 36.223c-4.6005-4.4976-8.3065-7.3272-2.5345-12.881l18.615-18.012c5.8997-5.9124 9.3501-5.6168 14.909 0l25.026 24.853 24.941-24.727c4.5579-4.5821 7.3907-8.2562 12.992-2.5339l18.125 18.455c5.9636 5.8491 5.6654 9.2909 0 14.781l-24.983 24.811 24.983 24.853c5.6442 5.4479 5.9423 8.8897 0 14.781l-18.189 18.455c-5.6016 5.7224-8.5195 2.1116-12.992-2.5128l-24.877-24.832-25.09 24.938c-5.4951 5.5745-8.9455 5.8702-14.909 0l-18.615-18.012c-5.772-5.5534-2.1299-8.4463 2.5345-12.881l25.026-24.79z' fill='#1C1C1C' stroke-width='2.1207'/></svg>`;
                                removeButton.addEventListener('click', (e)=>{
                                    try{
                                        const images = JSON.parse(fileInputData.value);
                                        const index = images.findIndex((element)=>element.name === image?.name && element.data === image?.data);
                                        
                                        if(index>-1){
                                            images.splice(index, 1);
                                            fileInputData.value = JSON.stringify(images);
                                            fileInputData.dispatchEvent(new Event('change'));
                                        }
                                    }catch(ex){}

                                    e.preventDefault();
                                    e.stopPropagation();
                                });
                                thumbnailWrapper.appendChild(removeButton);
                            });

                            previewContainer.replaceChildren(...previewContainerTmp.children);
                        }else{
                            previewContainer.textContent = "";
                        }
                    } catch (ex) {
                        console.error(ex);
                        const error = document.createElement('div');
                        error.innerText = 'Erro!';
                        previewContainer.appendChild(error);
                    }
                });
            }

            const processFiles = (files)=>{
                let imagesToSave = [];

                try{
                    imagesToSave = JSON.parse(fileInputData.value?.length>0?fileInputData.value:[]||[]);
                }catch(ex){};

                const loading = document.createElement('div');
                loading.classList.add('loading-thumbnail');
                loading.innerText = "A carregar...";
                previewContainer.appendChild(loading);

                const promises = [];
                for (let i = 0; i < files.length; i++) {
                    if (!files[i].type.match("image")) continue;
                    promises.push(new Promise((resolve, reject) => {
                        const imageReader = new FileReader();
                        imageReader.addEventListener("load", (e) => {
                            if(!!fileInputData){
                                if(imagesToSave.findIndex((element)=>element.name === files[i]?.name && element.data === e?.target?.result)<0){
                                    imagesToSave.push({name: files[i].name, data: e.target.result});
                                }
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
                    loading.remove();
                });
            };

            fileInput.addEventListener("change", (e) => {
                const features = [
                    'File',
                    'FileReader',
                    'FileList',
                    'Blob',
                ];
                if (!features.some(feature => !(feature in window))) {
                    processFiles(e.target.files);
                }
            });

            // Drag and drop support
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                previewContainerWrapper.addEventListener(eventName, (e)=>{
                    e.currentTarget.classList.toggle('highlight', ['dragenter', 'dragover'].includes(eventName));
                    e.preventDefault();
                    e.stopPropagation();
                }, false)
            });

            previewContainerWrapper.addEventListener('drop', e=>{
                processFiles(e.dataTransfer.files);
                e.preventDefault();
                e.stopPropagation();
            }, false);
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