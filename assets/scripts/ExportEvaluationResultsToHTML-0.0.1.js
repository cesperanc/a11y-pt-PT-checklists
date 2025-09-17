export default async (tests, formData, title='Resultados dos testes')=>{
        const doc = document.implementation.createHTMLDocument(title);

        document.createElement('meta').setAttribute('charset', 'utf-8');
        const metaViewport = document.createElement('meta');
        metaViewport.setAttribute('name', 'viewport');
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1');
        doc.head.appendChild(metaViewport);

        const commonStyles = await fetch('assets/styles/common-0.0.1.css').then(res=>res.text());
        const style = document.createElement('style');
        style.textContent = `
            .__evaluation_results{
                ${commonStyles}

                body .logo-update-btn {
                    margin: 20px auto;
                }

                #evaluationResultsPageTitle {
                    margin: 1.5rem 0;
                    color: var(--main-color);
                }
                .h1,.h2,.h3,.h4,.h5,.h6,h1,h2,h3,h4,h5,h6 {
                    margin-top: 1rem;
                    margin-bottom: 1rem;
                    font-weight: 500;
                    line-height: 1.2;
                }

                .h1,h1 {
                    font-size: calc(1.375rem + 1.5vw)
                }

                @media (min-width: 1200px) {
                    .h1,h1 {
                        font-size:2.5rem
                    }
                }

                .h2,h2 {
                    font-size: calc(1.325rem + .9vw)
                }

                @media (min-width: 1200px) {
                    .h2,h2 {
                        font-size:2rem
                    }
                }

                .h3,h3 {
                    font-size: calc(1.3rem + .6vw)
                }

                @media (min-width: 1200px) {
                    .h3,h3 {
                        font-size:1.75rem
                    }
                }

                .h4,h4 {
                    font-size: calc(1.275rem + .3vw)
                }

                @media (min-width: 1200px) {
                    .h4,h4 {
                        font-size:1.5rem
                    }
                }

                .h5,h5 {
                    font-size: 1.25rem
                }

                .h6,h6 {
                    font-size: 1rem
                }


                #evaluationResults summary.test-item{
                    cursor: pointer;
                    padding-left: var(--box-size, 1rem);
                    display: flex;
                    align-items: center;
                }
                #evaluationResults summary.test-item::before {
                    content: '❯';
                    padding: 0.3rem;
                    transition: transform 0.2s ease-in-out;
                    transform-origin: center center;
                    display: inline-block;
                    width: 1rem;
                    height: 1rem;
                    font-size: 1rem;
                    line-height: 1rem;
                    vertical-align: middle;
                    text-align: center;
                }
                #evaluationResults details[open] summary.test-item::before {
                    transform: rotate(90deg);
                }

                #evaluationResults .test-item .test-title{
                    margin-left: 0;
                }

                #evaluationResults .test-item .final-test-results-wrapper{
                    align-self: stretch;
                }

                #evaluationResults .test-details-contents{
                    display: block;
                    padding-left: calc(var(--box-size, 1rem));
                    border-left: var(--border);
                    padding: 2rem 0 1.5rem 0;
                }

                .test-results-label{
                    padding: 0.5rem 1rem;
                    font-size: 1rem;
                    font-weight: 500;
                }

                .test-result-notes-preview{
                    font-size: 0.9rem;
                }

                .form-group {
                    padding-top: 3rem;
                }

                .form-group-wrapper{
                    padding: var(--box-size, 1rem);
                }
            }
        `.replace(/\s+/g,' ');
        doc.head.appendChild(style);

        doc.documentElement.classList.add('__evaluation_results');
        doc.documentElement.setAttribute('lang', 'pt-PT');

        doc.body.innerHTML = `
            <a href="#evaluationResultsPageTitle" class="visually-hidden-focusable">Ir para o conteúdo</a>

            <main class="root">

                <div id="evaluationResultsPage" aria-labelledby="evaluationResultsPageTitle" class="results-container">
                    <div class="page">
                        <div class="logo-container inert">
                            <div type="button" id="logoFileButton" class="logo-update-btn">
                                <img class="logo" alt="Logótipo do relatório" style="max-width: 235px; width: 100%; height: auto;">
                            </div>
                        </div>

                        <h1 id="evaluationResultsPageTitle" class="h3">${title}</h1>


                        <div class="checklist-metadata-container">
                            <p class="report-metadata-item"><strong>Designação do sítio web:</strong> <span id="reportSiteDesignation">${formData['site-designation']||''}</span></p>
                            <p class="report-metadata-item"><strong>Endereço do sítio web:</strong> <span id="reportSiteURL">${formData['site-url']||''}</span></p>
                            <p class="report-metadata-item"><strong>Entidade:</strong> <span id="reportSiteEntity">${formData['site-entity']||''}</span></p>
                            <p class="report-metadata-item"><strong>Data da análise:</strong> <span id="reportSiteEvaluationDate">${formData['site-evaluation-date']||''}</span></p>
                        </div>

                        <div id="evaluationResults"></div>
                    </div>
                </div>
            </main>
        `;


        const logoImg = doc.querySelector('#logoFileButton .logo');
        let logoData = (formData['logoFileSrc']||'').toString().trim();
        if(logoData.length>0){
            try{
                logoData = JSON.parse(logoData);

                if(logoData?.name && logoData?.data){
                    if(!!logoImg){
                        logoImg.setAttribute('src', logoData.data);
                        // logoImg.setAttribute('alt', logoData.name);
                    }
                }
            }catch(e){}
        }
        if(!!logoImg && logoImg.hasAttribute('src')===false){
            logoImg.setAttribute('src', await fetch('assets/images/logo.svg').then(res=> res.text()).then(res=> 'data:image/svg+xml;base64,' + btoa(res)).catch(()=> ''));
        }

        const resultsContainer = doc.getElementById('evaluationResults');

        const testResultsSummaryWrapper = doc.createElement('div');
        testResultsSummaryWrapper.classList.add('tests-results-summary-wrapper');
        testResultsSummaryWrapper.innerHTML = `
        <table>
            <caption><h2 class="h4">Resumo dos testes de conformidade</h2></caption>
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
        };
        updateSummary();

        const testResultsWrapper = document.createElement('div');
        testResultsWrapper.classList.add('final-test-results-wrapper', 'test-results-labels');

        const testResultsTitle = document.createElement('h3');
        testResultsTitle.setAttribute('id', 'test-results-label');
        testResultsTitle.classList.add('h4');
        testResultsTitle.innerText = 'Detalhes dos testes';
        testResultsWrapper.appendChild(testResultsTitle);

        const testResultsContainer = document.createElement('span');
        testResultsContainer.setAttribute('role', 'presentation');
        testResultsContainer.setAttribute('aria-hidden', true);
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


        const updateTestOptionValue = (radio)=>{
            if(radio?.checked){
                switch(radio.value){
                    case 'P':
                        return '&check;';
                    case 'N':
                        return '&#10007;';
                    case 'NA':
                        return '&bull;';
                }
            }
            return '';
        };

        const groupsUl = document.createElement('ul');
        groupsUl.classList.add('test-groups');
        groupsUl.setAttribute('aria-labelledby', 'test-results-label');
        tests.forEach(group => {
            const groupLi = document.createElement('li');
            const groupLiA = document.createElement('div');
            // groupLiA.setAttribute('href', `#test-group-${group.ID}`);
            groupLiA.classList.add('test-group');
            groupLiA.innerText = group.fullName??'';
            groupLi.appendChild(groupLiA);

            const testUl = document.createElement('ul');
            testUl.classList.add('test-group-items');
            if(!!group.tests && Array.isArray(group.tests)){
                group.tests.forEach(test=>{
                    const testUlLi = document.createElement('li');
                    const testDetails = document.createElement('details');
                    const testDetailsSummary = document.createElement('summary');
                    // testUlLiA.setAttribute('href', `#test-g${group.ID}-t${test.ID}`);
                    testDetailsSummary.classList.add('test-item');

                    const testResultPrefix = document.createElement('span');
                    testResultPrefix.classList.add('test-title-prefix');
                    testResultPrefix.classList.add('visually-hidden');
                    testResultPrefix.innerText = '';
                    testDetailsSummary.appendChild(testResultPrefix);

                    const testLabel = document.createElement('span');
                    testLabel.classList.add('test-title');
                    testLabel.innerText = test.fullName??'';
                    testDetailsSummary.appendChild(testLabel);

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
                        testResultItem.innerHTML = updateTestOptionValue(radio);
                        const label = document.querySelector(`#test-g${group.ID}-t${test.ID}-wrapper .test-results label[for="${radio.id}"]`)?.innerText||'';
                        if(radio.checked){
                            testResultPrefix.innerHTML = label+':&nbsp;';
                            testResultItem.removeAttribute('hidden');
                            testResultItem.setAttribute('aria-label', `Resultado do teste: ${(label)}`);
                            testResultItem.setAttribute('title', label);
                        }else{
                            testResultItem.setAttribute('hidden', true);
                            testResultItem.removeAttribute('aria-label');
                            testResultItem.removeAttribute('title');
                        }
                        testResultsContainer.appendChild(testResultItem);
                    });
                    testResultsWrapper.appendChild(testResultsContainer);

                    testDetailsSummary.appendChild(testResultsWrapper);

                    testDetails.appendChild(testDetailsSummary);

                    const testDetailsContents = document.createElement('div');
                    testDetailsContents.classList.add('test-details-contents');

                    let resultItem = '';

                    let testNotes = (formData[`testNotes['group_${group.ID}']['test_${test.ID}']`]||'').trim();
                    resultItem += `
                        <div class="form-group-wrapper">
                            <div class="form-group test-result-notes">
                                <div>
                                    <h3 id="test-name_${group.ID}_test_${test.ID}-1_notes_label" class="test-results-notes test-results-label">
                                        Notas<span class="visually-hidden">:&nbsp;</span>
                                    </h3>
                                </div>
                                <div id="testNotes_group_${group.ID}_test_${test.ID}" class="test-result-notes-preview">
                                    ${((testNotes.length>0)?testNotes.split('\n').map(line => `<p>${line}</p>`).join(''):'Não foram adicionadas notas')}
                                </div>
                            </div>
                        </div>
                    `;

                    let testFacts = (formData[`testFacts['group_${group.ID}']['test_${test.ID}']`]||'').trim();

                    try{
                        testFacts = JSON.parse(testFacts);
                    }catch(e){
                        testFacts = [];
                    }
                    resultItem += `
                        <div class="form-group-wrapper">
                            <div class="form-group file-previews-input-wrapper">
                                <div>
                                    <h3 id="test-name_${group.ID}_test_${test.ID}-1_facts_label" class="test-results-facts test-results-label">
                                        Evidências<span class="visually-hidden">:&nbsp;</span>
                                    </h3>
                                </div>
                                <div id="testFacts_group_${group.ID}_test_${test.ID}" class="file-previews">
                                    ${((testFacts.length>0)?'<ul><li>'+testFacts.map(fact => {
                                        const label = (fact?.name||'').replace(/\.[^/.]+$/, '')||'Evidência';
                                        return `
                                            <div class="thumbnail-wrapper">
                                                <img decoding="async" loading="lazy" class="thumbnail" src="${fact?.data||''}" alt="${label}" title="${label}">
                                            </div>
                                        `;
                                    }).join('</li><li>')+'</li></ul>':'Não foram apresentadas evidências')}
                                </div>
                            </div>
                        </div>
                    `;

                    testDetailsContents.innerHTML = resultItem;
                    testDetails.appendChild(testDetailsContents);

                    testUlLi.appendChild(testDetails);
                    testUl.appendChild(testUlLi);
                });
            }
            groupLi.appendChild(testUl);

            groupsUl.appendChild(groupLi);
        });
        resultsContainer.appendChild(groupsUl);

        return '<!DOCTYPE html>\n'+doc.documentElement.outerHTML;
};