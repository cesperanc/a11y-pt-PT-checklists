

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
        const evaluationResultsPage = document.getElementById('evaluationResultsPage');
        const closeResultsBtn = document.getElementById('closeResultsBtn');
        const closeResultsBtnPercentage = closeResultsBtn?.querySelector('.donut-percent');
        const closeResultsBtnData = closeResultsBtn?.querySelector('.donut-data');

        return (tests)=>{
            if(!resultsContainer || !checkList || !Array.isArray(tests)) return;

            resultsContainer.textContent = '';


            const testResultsSummaryWrapper = document.createElement('div');
            testResultsSummaryWrapper.classList.add('tests-results-summary-wrapper');
            testResultsSummaryWrapper.innerHTML = `
            <table>
                <caption><h3>Resumo dos testes de conformidade</h3></caption>
                <tbody>
                    <tr>
                        <th scope="row">Bateria de testes</th>
                        <td id="number-of-tests"></td>
                    </tr>
                    <tr>
                        <th scope="row">Testes conformes</th>
                        <td id="number-of-successful-tests"></td>
                    </tr>
                    <tr>
                        <th scope="row">Testes não aplicáveis</th>
                        <td id="number-of-unappliable-tests"></td>
                    </tr>
                    <tr>
                        <th scope="row">Testes não conformes</th>
                        <td id="number-of-failed-tests"></td>
                    </tr>
                    <tr>
                        <th scope="row">Testes não avaliados</th>
                        <td id="number-of-unexecuted-tests"></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th scope="row">Nível de conformidade</th>
                        <td id="compliance-level"></td>
                    </tr>
                </tfoot>
            </table>
            `;
            resultsContainer.appendChild(testResultsSummaryWrapper);

            const updateSummary = ()=>{
                const checkResultsForType = (type)=>{
                    return tests.reduce((previousValue, group)=>{
                        return group.tests.reduce((previousValue, test)=>{
                            return previousValue+document.querySelectorAll(`#test-g${group.ID}-t${test.ID}-wrapper .test-results input[type="radio"][value="${type}"]:checked`).length;
                        }, previousValue);
                    }, 0);
                };
                const numberOfTests = tests.reduce((previousValue, group)=>previousValue+group.tests.length, 0);
                const numberOfSuccessfulTests = checkResultsForType('P');
                const numberOfFailedTests = checkResultsForType('N');
                const numberOfUnappliableTests = checkResultsForType('NA');
                const numberOfUntestedTests = numberOfTests-(numberOfSuccessfulTests+numberOfFailedTests+numberOfUnappliableTests);
                const completedPercentage = Math.round(((numberOfTests-numberOfUntestedTests)/numberOfTests)*100);
                const complianceLevel = Math.round((numberOfSuccessfulTests/(numberOfTests-numberOfUnappliableTests)) * 1000) / 10;

                const results = {
                    'number-of-tests': numberOfTests,
                    'number-of-successful-tests': numberOfSuccessfulTests,
                    'number-of-unappliable-tests': numberOfUnappliableTests,
                    'number-of-failed-tests': numberOfFailedTests,
                    'number-of-unexecuted-tests': numberOfUntestedTests,
                    'compliance-level': `${complianceLevel}%`,
                }
                Object.keys(results).forEach((dataKey)=>{
                    testResultsSummaryWrapper.querySelector(`#${dataKey}`).innerText = results[dataKey];
                });


                if(!!evaluationResultsPage){
                    evaluationResultsPage.style.setProperty('--progress', `${completedPercentage}%`);
                }

                if(!!closeResultsBtn){
                    closeResultsBtn.style.setProperty('--progress', `${completedPercentage}`);
                    if(!!closeResultsBtnPercentage){
                        closeResultsBtnPercentage.innerHTML = `${completedPercentage}%`;
                    }
                    if(!!closeResultsBtnData){
                        closeResultsBtnData.innerHTML = `${((numberOfTests-numberOfUntestedTests))}/${((numberOfTests))} testes`;
                    }
                }
            };
            updateSummary();

            const testResultsWrapper = document.createElement('div');
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

            const testResultsTitle = document.createElement('h3');
            testResultsTitle.innerText = 'Detalhes dos testes';
            testResultsWrapper.appendChild(testResultsTitle);

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

                                updateSummary();
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

                    // Drag and drop support
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

            const evaluationResultsPage = document.getElementById('evaluationResultsPage');
            if(!!evaluationResultsPage){
                const closeResultsBtn = document.createElement('button');
                closeResultsBtn.setAttribute('id', 'closeResultsBtn');
                closeResultsBtn.setAttribute('accesskey', 'm');
                closeResultsBtn.setAttribute('type', 'button');
                closeResultsBtn.setAttribute('aria-controls', evaluationResultsPage.id);
                closeResultsBtn.setAttribute('aria-expanded', 'false');
                closeResultsBtn.setAttribute('aria-label', 'Mostrar resumo dos testes de conformidade');
                closeResultsBtn.setAttribute('title', closeResultsBtn.getAttribute('aria-label'));
                closeResultsBtn.classList.add('close-button', 'no-print');
                const closeResultsBtnIcon = document.createElement('span');
                closeResultsBtnIcon.classList.add('burger-btn-icon');

                closeResultsBtnIcon.innerHTML = `
                    <svg width="100%" height="100%" viewBox="0 0 40 40" class="donut" role="img" aria-label="Percentagem de conclusão">
                        <circle class="donut-hole" cx="20" cy="20" r="19" fill="#fff"></circle>
                        <g class="donut-text-wrapper">
                            <g class="donut-text">
                                <text y="50%" transform="translate(0, 2)">
                                    <tspan x="50%" text-anchor="middle" class="donut-percent">0%</tspan>   
                                </text>
                                <text y="60%" transform="translate(0, 4)">
                                    <tspan x="50%" text-anchor="middle" class="donut-data"></tspan>   
                                </text>
                            </g>
                        </g>
                        <g class="donut-checklist" stroke-width=".70061" transform="translate(0, 30)">
                            <circle cx="15.796" cy="20" r="1.4012"/>
                            <path d="m17.694 15.598-1.369 1.3732c-0.17515 0.17025-0.42737 0.25922-0.67118 0.21509-0.20738-0.03783-0.8099-0.4603-0.93742-0.54227-0.32228-0.20318-0.42036-0.63756-0.21018-0.96894 0.20318-0.32228 0.63755-0.42177 0.96684-0.21018l0.2242 0.14012 1.0019-1.0054c0.27324-0.27324 0.72163-0.27324 0.99487 0 0.27324 0.27464 0.27324 0.72443 0 0.99837z"/>
                            <path d="m25.605 16.497c0 0.38534-0.31527 0.70061-0.70061 0.70061h-5.6119c-0.38534-7e-3 -0.6936-0.31527-0.6936-0.70061s0.30827-0.6936 0.6936-0.70061h5.6119c0.38534 0 0.70061 0.31528 0.70061 0.70061z"/>
                            <circle cx="15.796" cy="24.204" r="1.4012"/>
                            <path d="m25.605 20.701c0 0.38534-0.31527 0.70061-0.70061 0.70061h-5.6119c-0.38534-7e-3 -0.6936-0.31528-0.6936-0.70061s0.30827-0.6936 0.6936-0.70061h5.6119c0.38534 0 0.70061 0.31527 0.70061 0.70061zm0 4.2037c0 0.38534-0.31527 0.70061-0.70061 0.70061h-5.6119c-0.38534-7e-3 -0.6936-0.31527-0.6936-0.70061 0-0.38534 0.30827-0.6936 0.6936-0.70061h5.6119c0.38534 0 0.70061 0.31527 0.70061 0.70061z"/>
                            <path d="m27.006 11.593h-14.012c-0.77067 0-1.4012 0.63055-1.4012 1.4012v14.012c0 0.77067 0.63055 1.4012 1.4012 1.4012h14.012c0.77067 0 1.4012-0.63055 1.4012-1.4012v-14.012c0-0.77067-0.63055-1.4012-1.4012-1.4012zm0 15.063c0 0.19337-0.15694 0.3503-0.3503 0.3503h-13.312c-0.19337 0-0.3503-0.15694-0.3503-0.3503v-13.312c0-0.19337 0.15694-0.3503 0.3503-0.3503h13.312c0.19337 0 0.3503 0.15694 0.3503 0.3503z"/>
                        </g>

                        <circle class="donut-ring" cx="20" cy="20" r="19" fill="transparent" stroke-width="3.5"></circle>
                        <circle class="donut-segment" cx="20" cy="20" r="19" fill="transparent" stroke-width="3.5" stroke-dasharray="0 120" stroke-dashoffset="30"></circle>
                    </svg>
                `;
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
                        evaluationResultsPage.setAttribute('aria-hidden', !show);
                        evaluationResultsPage.classList.toggle('open', show);
                        if(show){
                            evaluationResultsPage.removeAttribute('inert');
                            requestAnimationFrame(()=>{
                                evaluationResultsPage.focus();
                            });
                            document.querySelectorAll('.inert').forEach(el=>el.setAttribute('inert', true));
                        }else{
                            evaluationResultsPage.setAttribute('inert', true);
                            document.querySelectorAll('.inert').forEach(el=>el.removeAttribute('inert'));
                        }
                        closeResultsBtn.setAttribute('aria-expanded', show);
                        closeResultsBtn.setAttribute('aria-label', show?'Ocultar resumo dos testes de conformidade':'Mostrar resumo dos testes de conformidade');
                        closeResultsBtn.setAttribute('title', closeResultsBtn.getAttribute('aria-label'));
                    }
                });

                evaluationResultsPage.querySelectorAll('a.test-item, a.test-group').forEach(link=>{
                    link.addEventListener('click', e=>{
                        e.preventDefault();
                        e.stopPropagation();
                        closeResultsBtn.setAttribute('aria-expanded', 'true');
                        closeResultsBtn.click();
                        const destinationEl = document.querySelector(e.currentTarget.getAttribute('href'));
                        if(!!destinationEl){
                            requestAnimationFrame(()=>{
                                destinationEl.scrollIntoView();
                                destinationEl.focus();
                            });
                        }
                    });
                });
                evaluationResultsPage.setAttribute('aria-hidden', true);
                evaluationResultsPage.setAttribute('inert', true);
                evaluationResultsPage.setAttribute('tabindex', 0);
                evaluationResultsPage.parentElement.insertBefore(closeResultsBtn, evaluationResultsPage);

                evaluationResultsPage.addEventListener('keyup', (e) => {
                    if (e.defaultPrevented && closeResultsBtn.getAttribute('aria-expanded')!=='true') return; // Do nothing if event already handled
    
                    if(e.key === 'Escape'){
                        closeResultsBtn.click();
                        requestAnimationFrame(()=>{
                            closeResultsBtn.focus();
                        });
                        e.preventDefault();
                    }
                });
            }
            const updateEvaluationResults = updateEvaluationResultsFactory();
            updateEvaluationResults(tests);

            const updateScrollWidth = ()=>{
                document.body.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.offsetWidth) + 'px');
            };
            window.addEventListener('resize',updateScrollWidth);
            document.addEventListener('DOMContentLoaded', updateScrollWidth);
            window.addEventListener('load', updateScrollWidth);
            updateScrollWidth();
        }
    };

    loadChecklist(CheckListTests||null);

    
});