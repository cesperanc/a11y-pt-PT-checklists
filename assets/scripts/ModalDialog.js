class ModalDialog extends HTMLElement {
    #shadowRoot=null;
    #initialOverflow=null;
    #paddingRight=0;

    constructor() {
        super();
        
        this.open = this.open.bind(this);
    }

    getStyle() {
        const style = document.createElement('style');
        style.innerHTML = `
            :scope .block {
                display: block;
            }
        `;
        return style;
    }

    getTemplate() {
        const template = document.createElement('template');
        template.innerHTML = `
            <div
                role="dialog"
                aria-modal="true"
                aria-hidden="true"
                className="dialog-container"
            >
            </div>
            <button type="button" class="close-preview" title="Fechar pré-visualização" aria-label="Fechar pré-visualização">
                <svg role="presentation" width="24" height="24" version='1.1' viewBox='0 0 122 122' xmlns='http://www.w3.org/2000/svg'><path d='m5.5643 36.223c-4.6005-4.4976-8.3065-7.3272-2.5345-12.881l18.615-18.012c5.8997-5.9124 9.3501-5.6168 14.909 0l25.026 24.853 24.941-24.727c4.5579-4.5821 7.3907-8.2562 12.992-2.5339l18.125 18.455c5.9636 5.8491 5.6654 9.2909 0 14.781l-24.983 24.811 24.983 24.853c5.6442 5.4479 5.9423 8.8897 0 14.781l-18.189 18.455c-5.6016 5.7224-8.5195 2.1116-12.992-2.5128l-24.877-24.832-25.09 24.938c-5.4951 5.5745-8.9455 5.8702-14.909 0l-18.615-18.012c-5.772-5.5534-2.1299-8.4463 2.5345-12.881l25.026-24.79z' fill='#1C1C1C' stroke-width='2.1207'/></svg>
            </type>
        `;
        return template.content;
    }

    connectedCallback() {
        if (!this.#shadowRoot) {
            this.#shadowRoot = this;
            //this.#shadowRoot = this.attachShadow({ mode: 'open' });
            //this.#shadowRoot.appendChild(this.getStyle().cloneNode(true));
            this.#shadowRoot.appendChild(this.getTemplate().cloneNode(true));
            this.setAttribute('aria-hidden', 'true');
            this.style.display = 'none';

            Object.assign(this.style, {
                position: 'fixed',
                height: '100%',
                width: '100%',
                top: 0,
                left: 0,
                right: 0,
                bottom: '0',
                //backdropFilter: 'blur(5px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
            });

            const dialog = this.getDialog();
                if(!!dialog){
                Object.assign(dialog.style, {
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                });
            }

            const closeBtn = this.querySelector('button.close-preview');
            if(!!closeBtn){
                Object.assign(closeBtn.style, {
                    position: 'absolute',
                    height: '44px',
                    width: '44px',
                    top: '1rem',
                    right: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                });
                closeBtn.addEventListener('click', e=>{
                    this.destroy();
                    e.preventDefault();
                    e.stopPropagation();
                });
            }

            this.addEventListener('click', this.destroy);
            this.addEventListener('keyup', (e) => {
                if (e.defaultPrevented) return; // Do nothing if event already handled

                if(e.key === 'Escape'){
                    this.destroy();
                    e.preventDefault();
                }
            });

            this.scrollTrack();
        }
    }

    scrollTrack(){
        const updateScrollWidth = ()=>{
            this.#paddingRight = (window.innerWidth - document.documentElement.offsetWidth) + 'px';
        };
        window.addEventListener('resize',updateScrollWidth);
        document.addEventListener('DOMContentLoaded', updateScrollWidth);
        window.addEventListener('load', updateScrollWidth);
        updateScrollWidth();
    }

    getDialog(){
        return this.querySelector('div[role="dialog"][aria-modal="true"]');
    }

    destroy(){
        requestAnimationFrame(()=>{
            this.parentElement.removeChild(this);
            document.body.style.paddingRight = 0;
            document.body.style.overflow=this.#initialOverflow;
            document.querySelectorAll('main,div[role="main"]').forEach(el=>{
                el.removeAttribute('inert');
                el.style.removeProperty('filter');
            });
        });
    }

    open(){
        this.setAttribute('aria-hidden', 'false');
        
        document.querySelectorAll('main,div[role="main"]').forEach(el=>{
            el.setAttribute('inert', true);
            el.style.filter = 'blur(5px)';
        });
        if(!!document.body){
            this.#initialOverflow = document.body.style.overflow;
            document.body.style.overflow='hidden';
            document.body.style.paddingRight = this.#paddingRight;
        }

        this.setAttribute('tabindex', 0);

        requestAnimationFrame(()=>{
            this.focus();
        });
    }
}

customElements.define('modal-dialog', ModalDialog);
export default ModalDialog;