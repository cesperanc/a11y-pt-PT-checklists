

document.documentElement.classList.replace('no-js', 'js');

document.addEventListener('DOMContentLoaded', ()=>{

    // 
    document.querySelectorAll('input.form-control, select.form-control').forEach(el=>{
        if(!!el.id && !!el.getAttribute('title') && !document.querySelector(`label[for="${el.id}"]`)){
            const label = document.createElement('label');
            label.setAttribute('for', el.id);
            label.setAttribute('tabindex', '-1');
            label.setAttribute('role', 'presentation');
            label.classList.add('form-control-label', 'foc-item', 'foc-item-required');
            label.innerHTML = el.getAttribute('title');
            el.addEventListener('focus', ()=>{
                el.parentElement.classList.add('as-label');
                el.parentElement.classList.remove('as-placeholder');
            });
            el.addEventListener('blur', ()=>{
                const hasContent = el.value.length>0;
                el.parentElement.classList.toggle('as-label', hasContent);
                el.parentElement.classList.toggle('as-placeholder', !hasContent);
            });
            el.dispatchEvent(new FocusEvent('blur', {'relatedTarget': el}));
            el.parentElement.insertBefore(label, el);
            
            const line = document.createElement('span');
            line.classList.add('form-control-line');
            el.after(line);

            el.removeAttribute('title');
        }
    });

    const updateEvaluationResultsFactory = ()=>{
        const resultsContainer = document.getElementById('evaluationResults');
        const checkList = document.getElementById('checklistTests');

        return (tests)=>{
            if(!resultsContainer || !checkList || !Array.isArray(tests)) return;

            resultsContainer.textContent = '';

            const testResultsWrapper = document.createElement('span');
            testResultsWrapper.classList.add('final-test-results-wrapper', 'test-results-labels');
            testResultsWrapper.setAttribute('role', 'presentation');
            testResultsWrapper.setAttribute('aria-hidden', true);

            const testResultsContainer = document.createElement('span');
            testResultsContainer.classList.add('test-results-container');

            const testResults = document.querySelector('.test-info .form-group.test-results');
            if(!!testResults){
                testResults.querySelectorAll('input[type="radio"]').forEach(radio=>{
                    const testResultItem = document.createElement('span');
                    testResultItem.classList.add('test-result-item', `test-result-item-${radio.value}`);
                    testResultItem.innerText = radio.value;
                    testResultItem.setAttribute('aria-label', testResults.querySelector(`label[for="${radio.id}"]`)?.innerText||'');
                    testResultItem.setAttribute('title', testResultItem.getAttribute('aria-label')||'');
                    testResultsContainer.appendChild(testResultItem);
                });
            }
            testResultsWrapper.appendChild(testResultsContainer);
            resultsContainer.appendChild(testResultsWrapper);

            const groupsUl = document.createElement('ul');
            groupsUl.classList.add('test-groups');
            tests.forEach(group => {
                const groupLi = document.createElement('li');
                const groupLiA = document.createElement('a');
                groupLiA.setAttribute('href', `#test-group-${group.ID}`);
                groupLiA.classList.add('test-group');
                groupLiA.innerText = group.fullName??'';
                groupLi.appendChild(groupLiA);

                const testUl = document.createElement('ul');
                testUl.classList.add('test-group-items');
                if(!!group.tests && Array.isArray(group.tests)){
                    group.tests.forEach(test=>{
                        const testUlLi = document.createElement('li');
                        const testUlLiA = document.createElement('a');
                        testUlLiA.setAttribute('href', `#test-g${group.ID}-t${test.ID}`);
                        testUlLiA.classList.add('test-item');

                        const testLabel = document.createElement('span');
                        testLabel.classList.add('test-title');
                        testLabel.innerText = test.fullName??'';
                        testUlLiA.appendChild(testLabel);

                        const testResultsWrapper = document.createElement('span');
                        testResultsWrapper.classList.add('final-test-results-wrapper');

                        const testResultsContainer = document.createElement('span');
                        testResultsContainer.classList.add('test-results-container');
                        testResultsContainer.setAttribute('role', 'radiogroup');
                        testResultsContainer.setAttribute('aria-readonly', 'true');

                        Array.from(document.querySelectorAll(`#test-g${group.ID}-t${test.ID}-wrapper .test-results input[type="radio"]`)).forEach((radio, index, radios)=>{
                            const testResultItem = document.createElement('span');
                            testResultItem.classList.add('test-result-item', `test-result-item-${radio.value}`);
                            //testResultItem.innerText = radio.value;
                            testResultItem.setAttribute('id', `${radio.id}_state_info`);
                            testResultItem.setAttribute('aria-current', radio.checked);
                            testResultItem.setAttribute('aria-hidden', !radio.checked);
                            const label = document.querySelector(`#test-g${group.ID}-t${test.ID}-wrapper .test-results label[for="${radio.id}"]`)?.innerText||'';
                            testResultItem.setAttribute('aria-label', `Resultado do teste: ${(label)}`);
                            testResultItem.setAttribute('title', label);
                            radio.addEventListener('change', (e)=>{
                                testResultItem.setAttribute('aria-current', e.currentTarget.checked);
                                testResultItem.setAttribute('aria-hidden', !radio.checked);
                                radios.filter(radio=>radio.value!==e.currentTarget.value).forEach(radio=>{
                                    const stateItem = document.getElementById(`${radio.id}_state_info`);
                                    if(!!stateItem && stateItem.getAttribute('aria-current')!=radio.checked){
                                        stateItem.setAttribute('aria-current', radio.checked);
                                        stateItem.setAttribute('aria-hidden', !radio.checked);
                                    }
                                });
                            });
                            testResultsContainer.appendChild(testResultItem);
                        });
                        testResultsWrapper.appendChild(testResultsContainer);

                        testUlLiA.appendChild(testResultsWrapper);

                        testUlLi.appendChild(testUlLiA);
                        testUl.appendChild(testUlLi);
                    });
                }
                groupLi.appendChild(testUl);

                groupsUl.appendChild(groupLi);
            });
            resultsContainer.appendChild(groupsUl);
        };
    }

    const loadChecklist = (tests)=>{
        const checkList = document.getElementById('checklistTests');
        const updateEvaluationResults = updateEvaluationResultsFactory();

        if(!!checkList && Array.isArray(tests)){
            checkList.textContent = '';

            tests.forEach(group => {
                const pageEl = document.createElement('test-group');
                pageEl.classList.add('page');
                checkList.appendChild(pageEl);
                
                // groupSection
                const groupSection = document.createElement('h2');
                //groupSection.setAttribute('slot', 'test-group-name');
                groupSection.innerText = group.fullName??'';
                groupSection.setAttribute('id', `test-group-${group.ID}`);
                const slotGroupName = pageEl.querySelector('slot[name="test-group-name"]');
                if(!!slotGroupName){
                    slotGroupName.parentElement.replaceChild(groupSection, slotGroupName);
                }

                // Tests
                if(!!group.tests && Array.isArray(group.tests)){
                    group.tests.forEach(test=>{
                        const testInfo = document.createElement('test-info');
                        testInfo.setAttribute('id', `test-g${group.ID}-t${test.ID}`);
                        testInfo.setAttribute('data-groupId', group.ID);
                        testInfo.setAttribute('data-testId', test.ID);
                        pageEl.appendChild(testInfo);

                        const testName = document.createElement('h3');
                        //testName.setAttribute('slot', 'test-name');
                        testName.innerText = test.fullName??'';
                        testInfo.appendChild(testName);
                        const slotTestName = testInfo.querySelector('slot[name="test-name"]');
                        if(!!slotTestName){
                            slotTestName.parentElement.replaceChild(testName, slotTestName);
                        }

                        const testDescription = document.createElement('p');
                        //testDescription.setAttribute('slot', 'test-name');
                        testDescription.innerText = test.description??'';
                        testInfo.appendChild(testDescription);
                        const slotTestDescription = testInfo.querySelector('slot[name="test-description"]');
                        if(!!slotTestDescription){
                            slotTestDescription.parentElement.replaceChild(testDescription, slotTestDescription);
                        }
                    });
                }

            });

            document.querySelectorAll('.test-result-facts input[type="file"]').forEach(el=>el.setAttribute('hidden', ''));
            document.querySelectorAll('.test-result-facts button.test-results-facts-browse-btn').forEach(el=>el.addEventListener('click', e=>{
                const fileInput = document.getElementById(e.currentTarget.getAttribute('data-controls'));
                if(!!fileInput){
                    fileInput.click();
                }
            }));

            // Update logo
            const logoFileButton = document.getElementById('logoFileButton');
            if(!!logoFileButton){
                const fileInput = document.getElementById(logoFileButton.getAttribute('data-controls'));
                const image = logoFileButton.querySelector('img');
                if(!!fileInput && !!image){
                    const fileInputData = document.getElementById(fileInput.getAttribute('data-controls'));
                    if(!!fileInputData){
                        fileInputData.addEventListener('change', e => {
                            try {
                                const logo = JSON.parse(e.currentTarget.value);
                                image.src = logo?.data;
                                image.alt = logo?.name;
                            }catch(ex){};
                        });
                    }

                    const processFiles = (files)=>{
                        const features = [
                            'File',
                            'FileReader',
                            'FileList',
                            'Blob',
                        ];
                        if (!features.some(feature => !(feature in window))) {
                            for (let i = 0; i < files.length; i++) {
                                if (!files[i].type.match("image")) continue;

                                const imageReader = new FileReader();
                                imageReader.addEventListener("load", (e) => {
                                    if(!!fileInputData){
                                        fileInputData.value = JSON.stringify({name: files[i].name, data: e.currentTarget.result});
                                        fileInputData.dispatchEvent(new Event('change'));
                                    }
                                });
                                imageReader.readAsDataURL(files[i]);

                                break;
                            }
                        }
                    }

                    fileInput.addEventListener('change', e => processFiles(e.currentTarget.files) );

                    logoFileButton.addEventListener('click', e => {
                        const fileInput = document.getElementById(e.currentTarget.getAttribute('data-controls'));
                        if(!!fileInput){
                            fileInput.click();
                        }
                    });

                    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                        logoFileButton.addEventListener(eventName, (e)=>{
                            e.currentTarget.classList.toggle('highlight', ['dragenter', 'dragover'].includes(eventName));
                            e.preventDefault();
                            e.stopPropagation();
                        }, false)
                    });

                    logoFileButton.addEventListener('drop', e=>{
                        processFiles(e.dataTransfer.files);
                        e.preventDefault();
                        e.stopPropagation();
                    }, false);

                    
                }
            }
            
            updateEvaluationResults(tests);


            const evaluationResultsPage = document.getElementById('evaluationResultsPage');
            if(!!evaluationResultsPage){
                const closeResultsBtn = document.createElement('button');
                closeResultsBtn.setAttribute('id', 'closeResultsBtn');
                closeResultsBtn.setAttribute('accesskey', 'm');
                closeResultsBtn.setAttribute('type', 'button');
                closeResultsBtn.setAttribute('aria-controls', evaluationResultsPage.id);
                closeResultsBtn.setAttribute('aria-expanded', 'false');
                closeResultsBtn.setAttribute('aria-label', 'Apresentar resultados');
                closeResultsBtn.classList.add('close-button', 'no-print');
                const closeResultsBtnIcon = document.createElement('span');
                closeResultsBtnIcon.classList.add('burger-btn-icon');
                for(let i=0; i<6; i++){
                    closeResultsBtnIcon.appendChild(document.createElement('span'));
                }
                closeResultsBtn.appendChild(closeResultsBtnIcon);

                closeResultsBtn.addEventListener('click', e=>{
                    const closeResultsBtn = e.currentTarget;
                    const show = e.currentTarget.getAttribute('aria-expanded')==='false';
                    if(!!evaluationResultsPage){
                        if(show && !!document.body.style.overflow){
                            closeResultsBtn.dataset.bodyOverflow = document.body.style.overflow;
                            document.body.style.overflow = 'hidden';
                        }else if('bodyOverflow' in closeResultsBtn.dataset){
                            document.body.style.overflow = closeResultsBtn.dataset.bodyOverflow;
                            delete closeResultsBtn.dataset.bodyOverflow;
                        }else{
                            if(show){
                                document.body.style.overflow = 'hidden';
                            }else{
                                document.body.style.removeProperty('overflow');
                            }
                        }
                        evaluationResultsPage.classList.toggle('open', show);
                        closeResultsBtn.setAttribute('aria-expanded', show);
                        closeResultsBtn.setAttribute('aria-label', show?'Ocultar resultados':'Apresentar resultados');
                    }
                });

                evaluationResultsPage.querySelectorAll('a.test-item, a.test-group').forEach(link=>{
                    link.addEventListener('click', e=>{
                        e.preventDefault();
                        e.stopPropagation();
                        closeResultsBtn.setAttribute('aria-expanded', 'true');
                        closeResultsBtn.click();
                        document.querySelector(e.currentTarget.getAttribute('href'))?.scrollIntoView();

                    });
                });
                document.body.appendChild(closeResultsBtn);
            }
        }
    };

    loadChecklist(CheckListTests||null);

    
});