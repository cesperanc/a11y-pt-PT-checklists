

document.documentElement.classList.replace('no-js', 'js');

document.addEventListener('DOMContentLoaded', ()=>{

    // 
    document.querySelectorAll('input.form-control, select.form-control').forEach(el=>{
        if(!!el.id && !!el.getAttribute('title') && !document.querySelector(`label[for="${el.id}"]`)){
            const label = document.createElement('label');
            label.setAttribute('for', el.id);
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
        }
    });

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
                            image.src = e.currentTarget.value;
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
                                        fileInputData.value = e.currentTarget.result;
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
            
        }
    };

    loadChecklist(CheckListTests||null);
    
});