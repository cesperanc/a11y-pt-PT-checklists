import Logo from "./Logo.js";
import InputFields from "./InputFields.js";
import AppMenu from "./AppMenu.js";
import TestsLoader from "./TestsLoader.js";

//https://github.com/101arrowz/fflate/blob/master/docs/README.md
//import * as fflate from 'https://cdn.skypack.dev/fflate?min';

document.documentElement.classList.replace('no-js', 'js');

class App {
    static #instance = null;
    #tests = [];
    #version = '';
    #form = null;
    #historyKey = 'checklist_history';

    constructor(config, version, formSelector) {
        if (App.#instance !== null) {
            return App.getInstance();
        }
        App.#instance = this;
        this.#form = document.querySelector(formSelector);

        App.executeOnContentLoaded(() => {
            Logo();
            InputFields();
            AppMenu(this);
            App.loadTests(config, version);
            App.#handleHistory();
        });
    }

    static getInstance() {
        return App.#instance;
    }

    static getForm() {
        return App.getInstance().#form;
    }

    static getFormData() {
        return Object.fromEntries(new FormData(App.getInstance().#form));
    }

    static getTests() {
        const app = App.getInstance();
        return {[app.#version]: app.#tests};
    }

    static getVersion() {
        return App.getInstance().#version;
    }

    static executeOnContentLoaded(callback) {
        if (typeof callback === 'function') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
            } else {
                callback();
            }
        }
    }

    static #handleHistory(){
        if('history' in window){
            App.getForm().addEventListener('change', (e)=>{
                const app = App.getInstance();
                const historyState = history.state?.[app.#historyKey];
                if(!historyState){
                    history.replaceState({ [app.#historyKey]: App.getFormData() }, '');
                }else{
                    if(e.target.name.length>0){
                        history.replaceState({ [app.#historyKey]: Object.assign(historyState, {
                            [e.target.name]:
                                e.target.type!=='file' && ((e.target.type==='hidden' && !e.target.classList.contains('file-mirror')) || e.target.type!=='hidden')?
                                (new FormData(app.#form)).get(e.target.name):
                                ''
                        }) }, '');
                    }
                }
            });
            
            const app = App.getInstance();
            const historyState = history.state?.[app.#historyKey];
            if(history.state && !!historyState){
                for ( let formItemKey in historyState ) {
                    if(historyState[formItemKey] && historyState[formItemKey].length>0){
                        const inputs = app.#form.querySelectorAll(`[name="${formItemKey}"]`);
                        if(inputs.length>0){
                            inputs.forEach(input => {
                                let triggerChange = false;
                                switch(input.type){
                                    case 'file':
                                        break;
                                    case 'radio':
                                    case 'checkbox':
                                        if(input.value===historyState[formItemKey]){
                                            input.checked = true;
                                            triggerChange = true;
                                        }
                                        break;
    
                                    default:
                                        input.value = historyState[formItemKey];
                                        triggerChange = true;
                                }
    
                                if(triggerChange){
                                    input.dispatchEvent(new Event('change'));
                                }
                            });
                        }
                    }
                }
            }

            window.addEventListener("beforeunload", (ev)=>{
                if(App.isDirty()){
                    ev.returnValue = 'Alguns dados poderão não ser guardados. Pretende continuar?';
                    ev.preventDefault();
                }
            }, {capture: true});
        }
    }

    static isDirty(){
        const formData = App.getFormData();
        const historyData = history.state?.[App.getInstance().#historyKey];

        // Types don't match
        if(typeof formData !== typeof historyData){
            return true;
        }

        const formDataKeys = Object.keys(formData).filter(key=>key!=='');
        const historyDataKeys = Object.keys(historyData).filter(key=>key!=='');
        // The keys don't match
        if(formDataKeys.filter(x => !historyDataKeys.includes(x)).concat(historyDataKeys.filter(x => !formDataKeys.includes(x))).length>0){
            return true;
        }
        
        // Values don't match
        for ( let dataItemKey in formData ) {
            if(formData?.[dataItemKey] !== historyData?.[dataItemKey]){
                return true;
            }
        }

        return false;
    }

    loadTests(config, version) {
        this.#version = version;
        this.#tests = config[this.#version] || [];
        TestsLoader(this.#tests);
    }

    static loadTests(config, version) {
        App.getInstance().loadTests(config, version);
    }

    static #getUnsupportedFeatures(features=[], context=window){
        const unsupportedFeatures = features.filter(feature => !(feature in context));
        if (unsupportedFeatures.length>0) {
            return unsupportedFeatures;
        }
        return [];
    }

    static saveFile() {
        const unsupportedFeatures = App.#getUnsupportedFeatures([
            'Blob',
            'URL',
        ]);
        if (unsupportedFeatures.length>0) {
            alert(unsupportedFeatures.length>1?`Não é possível guardar o ficheiro porque as funcionalidades "${(unsupportedFeatures).join('", "')}" não são suportadas.`:`Não é possível guardar o ficheiro porque a funcionalidade "${(unsupportedFeatures).join('')}" não é suportada.`);
            
            return;
        }

        const data = JSON.stringify({
            version: App.getVersion(),
            tests: App.getTests(),
            formData: App.getFormData(),
        });

        const download = (data, type='application/json', filename='CheckList.json')=>{
            const downloadLink = document.createElement("a");
            downloadLink.download = filename;
            downloadLink.href = URL.createObjectURL(new Blob([data], { type: type }));
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            downloadLink.remove();
        };

        if(typeof fflate!=="undefined"){
            fflate.gzip(fflate.strToU8(data), { filename: 'CheckList.json', level: 6, mem: 8 }, (err, compressedData)=>{
                if(err===null){
                    download(compressedData, 'application/gzip', 'CheckList.gz');
                }
            });
        }else{
            download(data, 'application/json', 'CheckList.json');
        }
    }

    static openFile() {
        const unsupportedFeatures = App.#getUnsupportedFeatures([
            'File',
            'FileReader',
            'FileList',
            'Blob',
        ]);
        if (unsupportedFeatures.length>0) {
            alert(unsupportedFeatures.length>1?`Não é possível abrir o ficheiro porque as funcionalidades "${(unsupportedFeatures).join('", "')}" não são suportadas.`:`Não é possível abrir o ficheiro porque a funcionalidade "${(unsupportedFeatures).join('')}" não é suportada.`);
            return;
        }

        const openFile = document.createElement("input");
        openFile.setAttribute('type', 'file');
        openFile.setAttribute('accept', 'application/json'+(typeof fflate!=="undefined"?',application/gzip':''));
        openFile.addEventListener("change", (e) => {
            const files = e.target.files;
            for (let i = 0; i < files.length; i++) {
                if (!files[i].type.match('application/json') && (typeof fflate!=="undefined" && !files[i].type.match('application/gzip'))) continue;
                const fr = new FileReader();
                fr.addEventListener("load", e => {
                    const load = (rawData)=>{
                        try{
                            const data = JSON.parse(rawData);
                            if(!data.version || !data.tests || !data?.formData || !data.tests[data.version]){
                                throw new Error('O formato do ficheiro é inválido');
                            }
                            App.loadTests(data.tests, data.version);
    
                            const form = App.getForm();
                            for ( let formItemKey in data?.formData ) {
                                const value = data.formData[formItemKey];
                                const inputs = form.querySelectorAll(`[name="${formItemKey}"]`);
                                if(inputs.length>0){
                                    inputs.forEach(input => {
                                        let triggerChange = false;
                                        switch(input.type){
                                            case 'file':
                                                break;
                                            case 'radio':
                                            case 'checkbox':
                                                if(input.value===value){
                                                    input.checked = true;
                                                    triggerChange = true;
                                                }
                                                break;
    
                                            default:
                                                input.value = data.formData[formItemKey];
                                                triggerChange = true;
                                        }
    
                                        if(triggerChange){
                                            input.dispatchEvent(new Event('change'));
                                        }
                                    });
                                }
                            }
                        }catch(ex){
                            console.error(ex);
                            alert(`Ocorreu um erro ao importar o ficheiro: ${ex.message}`);
                        }
                    };
                        
                    if(files[i].type.match('application/json')){
                        load(e.target.result);
                    }else if(files[i].type.match('application/gzip') && typeof fflate!=="undefined"){
                        if(typeof fflate!=="undefined"){
                            fflate.gunzip(new Uint8Array(e.target.result), { filename: 'CheckList.json' }, (err, decompressedData)=>{
                                if(err===null){
                                    load(fflate.strFromU8(decompressedData));
                                }
                            });
                        }else{
                            alert('Erro ao processar o ficheiro');
                        }
                    }
                });
                if(files[i].type.match('application/json')){
                    fr.readAsText(files[i]);
                }else if(files[i].type.match('application/gzip')){
                    fr.readAsArrayBuffer(files[i]);
                }
                break;
            }

            openFile.remove();
        });
        openFile.style.display = "none";
        document.body.appendChild(openFile);
        openFile.click();
    }
}

export default App;

