import { TagName as TestGroup } from "./TestGroupComponent.js";
import { TagName as TestInfo } from "./TestInfoComponent.js";
import UpdateEvaluationResultsFactory from "./EvaluationResultsFactory.js";

export default (tests) =>{
    const checkList = document.getElementById('checklistTests');

    if(!!checkList && Array.isArray(tests)){
        checkList.textContent = '';

        tests.forEach(group => {
            const pageEl = document.createElement(TestGroup);
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
                    const testInfo = document.createElement(TestInfo);
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

        const updateEvaluationResults = UpdateEvaluationResultsFactory();
        updateEvaluationResults(tests);
    }
};