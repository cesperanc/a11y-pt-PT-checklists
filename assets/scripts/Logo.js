export default ()=>{
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
};