class TestGroup extends HTMLElement {
    #shadowRoot=null;

    constructor() {
        super();
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
            <div class="test-group">
                <div class="test-group-name"><slot name="test-group-name">Grupo de teste</slot></div>
                <div class="test-group-content"><slot></slot></div>
            </div>
        `;
        return template.content;
    }

    connectedCallback() {
        if (!this.#shadowRoot) {
            this.#shadowRoot = this;
            //this.#shadowRoot = this.attachShadow({ mode: 'open' });
            //this.#shadowRoot.appendChild(this.getStyle().cloneNode(true));
            this.#shadowRoot.appendChild(this.getTemplate().cloneNode(true));
        }
    }
}

customElements.define('test-group', TestGroup);
export default TestGroup;