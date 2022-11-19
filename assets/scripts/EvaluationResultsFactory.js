export default ()=>{
    const resultsContainer = document.getElementById('evaluationResults');
    const checkList = document.getElementById('checklistTests');
    const evaluationResultsPage = document.getElementById('evaluationResultsPage');
    const menuBtn = document.getElementById('menuBtn');
    const menuBtnPercentage = menuBtn?.querySelector('.donut-percent');
    const menuBtnData = menuBtn?.querySelector('.donut-data');
    const menuCompletion = menuBtn?.querySelector('#completion-info');

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
                    <th scope="row">Total de heurísticas</th>
                    <td id="number-of-tests"></td>
                </tr>
                <tr>
                    <th scope="row">Testes conformes</th>
                    <td id="number-of-successful-tests"></td>
                </tr>
                <tr>
                    <th scope="row">Testes não conformes</th>
                    <td id="number-of-failed-tests"></td>
                </tr>
                <tr>
                    <th scope="row">Testes não aplicáveis</th>
                    <td id="number-of-unappliable-tests"></td>
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

            if(!!menuBtn){
                menuBtn.style.setProperty('--progress', `${completedPercentage}`);
                if(!!menuBtnPercentage){
                    menuBtnPercentage.innerHTML = `${completedPercentage}%`;
                }
                if(!!menuBtnData){
                    menuBtnData.innerHTML = `${((numberOfTests-numberOfUntestedTests))}/${((numberOfTests))} testes`;
                }
                if(!!menuCompletion){
                    menuCompletion.innerHTML = `${completedPercentage}% concluído. ${((numberOfTests-numberOfUntestedTests))} de ${((numberOfTests))} testes realizados.`;
                }
            }
        };
        updateSummary();

        const testResultsWrapper = document.createElement('div');
        testResultsWrapper.classList.add('final-test-results-wrapper', 'test-results-labels');
        testResultsWrapper.setAttribute('role', 'presentation');
        testResultsWrapper.setAttribute('aria-hidden', true);

        const testResultsTitle = document.createElement('h3');
        testResultsTitle.innerText = 'Detalhes dos testes';
        testResultsWrapper.appendChild(testResultsTitle);

        const testResultsContainer = document.createElement('span');
        testResultsContainer.classList.add('test-results-container');

        const testResults = document.querySelector('.test-info .form-group.test-results');
        if(!!testResults){
            testResults.querySelectorAll('input[type="radio"]').forEach(radio=>{
                const testResultItem = document.createElement('span');
                testResultItem.classList.add('test-result-item', `test-result-item-${radio.value}`);
                testResultItem.innerText = radio.value;
                requestAnimationFrame(()=>{
                    const label = testResults.querySelector(`label[for="${radio.id}"]`)?.innerText||'';
                    testResultItem.setAttribute('aria-label', label);
                    testResultItem.setAttribute('title', label);
                });
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

                    const testResultPrefix = document.createElement('span');
                    testResultPrefix.classList.add('test-title-prefix');
                    testResultPrefix.classList.add('visually-hidden');
                    testResultPrefix.innerText = '';
                    testUlLiA.appendChild(testResultPrefix);

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
                        testResultItem.setAttribute('data-current', radio.checked);
                        testResultItem.setAttribute('aria-hidden', !radio.checked);
                        requestAnimationFrame(()=>{
                            const label = document.querySelector(`#test-g${group.ID}-t${test.ID}-wrapper .test-results label[for="${radio.id}"]`)?.innerText||'';
                            testResultItem.setAttribute('aria-label', `Resultado do teste: ${(label)}`);
                            testResultItem.setAttribute('title', label);
                            if(radio.checked){
                                testResultPrefix.innerHTML = label+':&nbsp;';
                            }
                        });
                        radio.addEventListener('change', (e)=>{
                            testResultItem.setAttribute('data-current', e.currentTarget.checked);
                            testResultItem.setAttribute('aria-hidden', !radio.checked);
                            if(radio.checked){
                                testResultPrefix.innerHTML = document.querySelector(`#test-g${group.ID}-t${test.ID}-wrapper .test-results label[for="${radio.id}"]`)?.innerText+':&nbsp;'||'';
                            }
                            radios.filter(radio=>radio.value!==e.currentTarget.value).forEach(radio=>{
                                const stateItem = document.getElementById(`${radio.id}_state_info`);
                                if(!!stateItem && stateItem.getAttribute('data-current')!=radio.checked){
                                    stateItem.setAttribute('data-current', radio.checked);
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

        evaluationResultsPage.querySelectorAll('a.test-item, a.test-group').forEach(link => {
            const menuItemResults = document.getElementById('resultsMenuItem');
            link.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                menuItemResults.setAttribute('aria-expanded', 'true');
                menuItemResults.click();
                const destinationEl = document.querySelector(e.currentTarget.getAttribute('href'));
                if (!!destinationEl) {
                    requestAnimationFrame(() => {
                        destinationEl.scrollIntoView();
                        if(destinationEl.getAttribute('tabindex')===null){
                            destinationEl.setAttribute('tabindex', -1);
                        }
                        requestAnimationFrame(()=>destinationEl.focus());
                    });
                }
            });
        });
        evaluationResultsPage.setAttribute('aria-hidden', true);
        evaluationResultsPage.setAttribute('inert', true);

        evaluationResultsPage.addEventListener('keyup', (e) => {
            const menuItemResults = document.getElementById('resultsMenuItem');
            if (e.defaultPrevented && menuItemResults.getAttribute('aria-expanded') !== 'true') return; // Do nothing if event already handled

            if (e.key === 'Escape') {
                menuItemResults.click();
                requestAnimationFrame(() => {
                    menuItemResults.focus();
                });
                e.preventDefault();
            }
        });
    };
};