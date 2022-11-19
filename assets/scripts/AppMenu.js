import Menu from "./MenuA11y.js";
import App from "./App.js";

export default () => {
    const evaluationResultsPage = document.getElementById('evaluationResultsPage');
    if (!!evaluationResultsPage) {
        const menuContainer = document.createElement('div');
        menuContainer.classList.add('app-menu-container', 'no-print');

        const menuEl = document.createElement('ul');
        menuEl.setAttribute('id', 'appMenu');
        menuEl.classList.add('app-menu');
        menuEl.setAttribute('role', 'menu');
        menuEl.setAttribute('aria-label', 'Menu de ferramentas');
        menuEl.setAttribute('title', menuEl.getAttribute('aria-label'));
        menuEl.setAttribute('aria-hidden', 'true');
        menuEl.setAttribute('inert', true);

        const menuBtn = document.createElement('button');

        // Save button
        const menuItemSave = document.createElement('li');
        menuItemSave.setAttribute('id', 'saveMenuItem');
        menuItemSave.classList.add('menu-entry-item', 'menu-entry-save');
        menuItemSave.setAttribute('role', 'menuitem');
        menuItemSave.innerHTML = `<svg fill="currentColor" width="100%" height="100%" role="presentation" version="1.1" viewBox="0 0 40 40" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g><path d="m27.006 11.593h-14.012c-0.77067 0-1.4012 0.63055-1.4012 1.4012v14.012c0 0.77067 0.63055 1.4012 1.4012 1.4012h14.012c0.77067 0 1.4012-0.63055 1.4012-1.4012v-14.012c0-0.77067-0.63055-1.4012-1.4012-1.4012zm0 15.063c0 0.19337-0.15694 0.3503-0.3503 0.3503h-13.312c-0.19337 0-0.3503-0.15694-0.3503-0.3503v-13.312c0-0.19337 0.15694-0.3503 0.3503-0.3503h13.312c0.19337 0 0.3503 0.15694 0.3503 0.3503z" stroke-width=".701"/><path d="m19.929 11.594c-0.33264 0.03505-0.59332 0.33033-0.59332 0.68152v9.1726l-1.9884-1.9804c-0.26486-0.2649-0.68876-0.2734-0.94611-0.01606-0.25748 0.25738-0.25686 0.68925 0.0082 0.95413l3.0548 3.0468c0.0053 0.0074 0.01022 0.01683 0.01601 0.02406l0.04811 0.04011c0.0013 0.0013-0.0014 0.0067 0 8e-3 0.01478 0.01474 0.03243 0.02705 0.04811 0.04011 0.05295 0.04378 0.10702 0.0799 0.16839 0.10424h0.0082c0.0078 0.0032 0.01642 0.0051 0.02422 8e-3 0.0082 3e-3 0.0156 0.0053 0.02422 8e-3 0.06424 0.01942 0.12537 0.0328 0.19241 0.03206 0.0027 5.9e-5 0.0053-2.9e-5 0.0082 0 0.08514 9.26e-4 0.16897-0.01654 0.24857-0.04811l0.0082-8e-3c0.0045-0.0019 0.01187 0.0019 0.01601 0 0.07118-0.03136 0.14212-0.078 0.20046-0.1363 0.0016-0.0016-0.0015-0.0064 0-8e-3l0.04023-0.04011 3.0709-3.0708c0.26486-0.26488 0.27353-0.69675 0.01601-0.95413-0.25735-0.25735-0.68123-0.24875-0.94611 0.01606l-1.9965 1.9884v-9.1806c0-0.3746-0.29352-0.68152-0.65746-0.68152-0.02258 0-0.05-0.0024-0.07217 0z" stroke-width=".67136"/></g></svg>`;
        menuItemSave.tabIndex = 0;
        menuItemSave.setAttribute('aria-label', 'Guardar formulário');
        menuItemSave.setAttribute('title', menuItemSave.getAttribute('aria-label'));
        menuItemSave.addEventListener('click', e => {
            e.preventDefault();
            menuBtn.dispatchEvent(new Event('click'));
            requestAnimationFrame(() => {
                menuItemSave.focus();
            });
            App.saveFile();
        });
        menuEl.appendChild(menuItemSave);
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                menuItemSave.dispatchEvent(new Event('click'));
            }
        });

        // Save button
        const menuItemImport = document.createElement('li');
        menuItemImport.setAttribute('id', 'importMenuItem');
        menuItemImport.classList.add('menu-entry-item', 'menu-entry-import');
        menuItemImport.setAttribute('role', 'menuitem');
        menuItemImport.innerHTML = `<svg fill="currentColor" width="100%" height="100%" role="presentation" version="1.1" viewBox="0 0 40 40" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g><path d="m27.006 28.407h-14.012c-0.77067 0-1.4012-0.63055-1.4012-1.4012v-14.012c0-0.77067 0.63055-1.4012 1.4012-1.4012h14.012c0.77067 0 1.4012 0.63055 1.4012 1.4012v14.012c0 0.77067-0.63055 1.4012-1.4012 1.4012zm0-15.063c0-0.19337-0.15694-0.3503-0.3503-0.3503h-13.312c-0.19337 0-0.3503 0.15694-0.3503 0.3503v13.312c0 0.19337 0.15694 0.3503 0.3503 0.3503h13.312c0.19337 0 0.3503-0.15694 0.3503-0.3503z" stroke-width=".701"/><path d="m19.929 28.406c-0.33264-0.03505-0.59332-0.33033-0.59332-0.68152v-9.1726l-1.9884 1.9804c-0.26486 0.2649-0.68876 0.2734-0.94611 0.01606-0.25748-0.25738-0.25686-0.68925 0.0082-0.95413l3.0548-3.0468c0.0053-0.0074 0.01022-0.01683 0.01601-0.02406l0.04811-0.04011c0.0013-0.0013-0.0014-0.0067 0-8e-3 0.01478-0.01474 0.03243-0.02705 0.04811-0.04011 0.05295-0.04378 0.10702-0.0799 0.16839-0.10424h0.0082c0.0078-0.0032 0.01642-0.0051 0.02422-8e-3 0.0082-3e-3 0.0156-0.0053 0.02422-8e-3 0.06424-0.01942 0.12537-0.0328 0.19241-0.03206 0.0027-5.9e-5 0.0053 2.9e-5 0.0082 0 0.08514-9.26e-4 0.16897 0.01654 0.24857 0.04811l0.0082 8e-3c0.0045 0.0019 0.01187-0.0019 0.01601 0 0.07118 0.03136 0.14212 0.078 0.20046 0.1363 0.0016 0.0016-0.0015 0.0064 0 8e-3l0.04023 0.04011 3.0709 3.0708c0.26486 0.26488 0.27353 0.69675 0.01601 0.95413-0.25735 0.25735-0.68123 0.24875-0.94611-0.01606l-1.9965-1.9884v9.1806c0 0.3746-0.29352 0.68152-0.65746 0.68152-0.02258 0-0.05 0.0024-0.07217 0z" stroke-width=".67136"/></g></svg>`;
        menuItemImport.tabIndex = 0;
        menuItemImport.setAttribute('aria-label', 'Importar formulário');
        menuItemImport.setAttribute('title', menuItemImport.getAttribute('aria-label'));
        menuItemImport.addEventListener('click', e => {
            e.preventDefault();
            menuBtn.dispatchEvent(new Event('click'));
            requestAnimationFrame(() => {
                menuItemImport.focus();
            });
            App.openFile();
        });
        menuEl.appendChild(menuItemImport);
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
                e.preventDefault();
                menuItemImport.dispatchEvent(new Event('click'));
                requestAnimationFrame(() => {
                    menuItemImport.focus();
                });
            }
        });


        // Results button
        const menuItemResults = document.createElement('li');
        menuItemResults.setAttribute('id', 'resultsMenuItem');
        menuItemResults.classList.add('menu-entry-item', 'menu-entry-results');
        menuItemResults.setAttribute('role', 'menuitem');
        menuItemResults.innerHTML = `<svg  fill="currentColor" width="100%" height="100%" role="presentation" version="1.1" viewBox="0 0 40 40" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
            <g class="results-checlist-icon" stroke-width=".70061">
                <circle cx="15.796" cy="20" r="1.4012"/>
                <path d="m17.694 15.598-1.369 1.3732c-0.17515 0.17025-0.42737 0.25922-0.67118 0.21509-0.20738-0.03783-0.8099-0.4603-0.93742-0.54227-0.32228-0.20318-0.42036-0.63756-0.21018-0.96894 0.20318-0.32228 0.63755-0.42177 0.96684-0.21018l0.2242 0.14012 1.0019-1.0054c0.27324-0.27324 0.72163-0.27324 0.99487 0 0.27324 0.27464 0.27324 0.72443 0 0.99837z"/>
                <path d="m25.605 16.497c0 0.38534-0.31527 0.70061-0.70061 0.70061h-5.6119c-0.38534-7e-3 -0.6936-0.31527-0.6936-0.70061s0.30827-0.6936 0.6936-0.70061h5.6119c0.38534 0 0.70061 0.31528 0.70061 0.70061z"/>
                <circle cx="15.796" cy="24.204" r="1.4012"/>
                <path d="m25.605 20.701c0 0.38534-0.31527 0.70061-0.70061 0.70061h-5.6119c-0.38534-7e-3 -0.6936-0.31528-0.6936-0.70061s0.30827-0.6936 0.6936-0.70061h5.6119c0.38534 0 0.70061 0.31527 0.70061 0.70061zm0 4.2037c0 0.38534-0.31527 0.70061-0.70061 0.70061h-5.6119c-0.38534-7e-3 -0.6936-0.31527-0.6936-0.70061 0-0.38534 0.30827-0.6936 0.6936-0.70061h5.6119c0.38534 0 0.70061 0.31527 0.70061 0.70061z"/>
                <path d="m27.006 11.593h-14.012c-0.77067 0-1.4012 0.63055-1.4012 1.4012v14.012c0 0.77067 0.63055 1.4012 1.4012 1.4012h14.012c0.77067 0 1.4012-0.63055 1.4012-1.4012v-14.012c0-0.77067-0.63055-1.4012-1.4012-1.4012zm0 15.063c0 0.19337-0.15694 0.3503-0.3503 0.3503h-13.312c-0.19337 0-0.3503-0.15694-0.3503-0.3503v-13.312c0-0.19337 0.15694-0.3503 0.3503-0.3503h13.312c0.19337 0 0.3503 0.15694 0.3503 0.3503z"/>
            </g>
            <g class="closeIcon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
                <path class="close-dash tl" d="m15 15 5 5"/>
                <path class="close-dash tr" d="m25 15-5 5"/>
                <path class="close-dash br" d="m20 20 5 5"/>
                <path class="close-dash bl" d="m20 20-5 5"/>
            </g>
        </svg>`;
        menuItemResults.tabIndex = 0;
        menuItemResults.setAttribute('aria-controls', evaluationResultsPage.id);
        menuItemResults.setAttribute('aria-expanded', 'false');
        menuItemResults.setAttribute('aria-label', 'Mostrar resumo dos testes de conformidade');
        menuItemResults.setAttribute('title', menuItemResults.getAttribute('aria-label'));
        menuItemResults.addEventListener('click', e => {
            const menuBtn = e.currentTarget;
            const show = e.currentTarget.getAttribute('aria-expanded') === 'false';
            if (!!evaluationResultsPage) {
                if (show && !!document.body.style.overflow) {
                    menuBtn.dataset.bodyOverflow = document.body.style.overflow;
                    document.body.style.overflow = 'hidden';
                } else if ('bodyOverflow' in menuBtn.dataset) {
                    document.body.style.overflow = menuBtn.dataset.bodyOverflow;
                    delete menuBtn.dataset.bodyOverflow;
                } else {
                    if (show) {
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.removeProperty('overflow');
                    }
                }
                evaluationResultsPage.setAttribute('aria-hidden', !show);
                evaluationResultsPage.classList.toggle('open', show);
                if (show) {
                    evaluationResultsPage.setAttribute('tabindex', 0);
                    evaluationResultsPage.removeAttribute('inert');
                    // requestAnimationFrame(()=>{
                    //     evaluationResultsPage.focus();
                    // });
                    document.querySelectorAll('.inert').forEach(el => el.setAttribute('inert', true));
                } else {
                    evaluationResultsPage.removeAttribute('tabindex');
                    evaluationResultsPage.setAttribute('inert', true);
                    document.querySelectorAll('.inert').forEach(el => el.removeAttribute('inert'));
                }
                menuBtn.setAttribute('aria-expanded', show);
                menuBtn.setAttribute('aria-label', show ? 'Ocultar resumo dos testes de conformidade; pressionar a tecla Tab para ir para o resumo' : 'Mostrar resumo dos testes de conformidade');
                menuBtn.setAttribute('title', menuBtn.getAttribute('aria-label'));
            }
        });
        document.addEventListener('keydown', e => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
                e.preventDefault();
                menuBtn.dispatchEvent(new Event('click'));
                menuItemResults.dispatchEvent(new Event('click'));
                requestAnimationFrame(() => {
                    menuItemResults.focus();
                });
            }
        });
        if (!!evaluationResultsPage) {
            evaluationResultsPage.setAttribute('aria-hidden', true);
        }
        menuEl.appendChild(menuItemResults);
        
        evaluationResultsPage.parentElement.insertBefore(menuContainer, evaluationResultsPage);

        // Some trigonometry to position the menu item in the radial menu
        const PI = Math.PI;
        const minAngle = 260;
        const maxAngle = 440;
        const step = (maxAngle - minAngle) / menuEl.children.length;
        Array.from(menuEl.children).forEach((el, index) => {
            const angle = minAngle + index * step;
            el.style.setProperty('--xC', Math.cos(angle * PI / 180 - PI / 2));
            el.style.setProperty('--yC', Math.sin(angle * PI / 180 - PI / 2));
        });

        menuContainer.appendChild(menuEl);

        menuBtn.setAttribute('id', 'menuBtn');
        menuBtn.setAttribute('accesskey', 'm');
        menuBtn.setAttribute('type', 'button');
        menuBtn.setAttribute('aria-controls', menuEl.id);
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-haspopup', 'true');
        menuBtn.setAttribute('aria-label', 'Mostrar menu');
        menuBtn.setAttribute('title', menuBtn.getAttribute('aria-label'));
        menuBtn.classList.add('menu-button', 'no-print');
        menuBtn.addEventListener('click', e => {
            const menuBtn = e.currentTarget;
            const show = e.currentTarget.getAttribute('aria-expanded') === 'false';
            const menu = document.getElementById(menuBtn.getAttribute('aria-controls'));
            menuBtn.setAttribute('aria-expanded', show);
            menuBtn.setAttribute('aria-label', show ? 'Ocultar menu' : 'Mostrar menu');
            menuBtn.setAttribute('title', menuBtn.getAttribute('aria-label'));
            if (!!menu) {
                menu.classList.toggle('open', show);
                menu.setAttribute('aria-hidden', !show);
                if (show) {
                    menu.removeAttribute('inert');
                } else {
                    menu.setAttribute('inert', true);
                }
            }

            if (e.defaultPrevented && menuItemResults.getAttribute('aria-expanded') !== 'true') return; // Do nothing if event already handled

            if (!show && menuItemResults.getAttribute('aria-expanded') === 'true') {
                menuItemResults.click();
            }
        });
        const menuBtnIcon = document.createElement('span');
        menuBtnIcon.classList.add('burger-btn-icon');

        menuBtnIcon.innerHTML = `
            <svg width="100%" height="100%" viewBox="0 0 40 40" class="donut" role="img" aria-labelledby="completion-info">
                <circle class="donut-hole" cx="20" cy="20" r="19" fill="#fff"></circle>
                <g class="donut-text-wrapper">
                    <g class="donut-text" aria-hidden="true">
                        <text y="50%" transform="translate(0, 2)">
                            <tspan x="50%" text-anchor="middle" class="donut-percent">0%</tspan>   
                        </text>
                        <text y="60%" transform="translate(0, 5)">
                            <tspan x="50%" text-anchor="middle" class="donut-data"></tspan>   
                        </text>
                    </g>
                </g>
                <g class="donut-checklist" stroke-width=".70061" transform="matrix(1.6,0,0,1.6,-16,-15)">
                    <g stroke="currentColor" fill="currentColor"><g stroke-width="1.3" stroke-linejoin="round"><circle cx="25.204" cy="19.857" r=".6" paint-order="markers stroke fill"/><circle cx="21.328" cy="21.179" r=".6" paint-order="markers stroke fill"/><circle cx="20.287" cy="24.997" r=".6" paint-order="markers stroke fill"/></g><circle cx="24.57" cy="24.342" r="1" stroke-width="2.165" paint-order="markers stroke fill" stroke-linejoin="round"/></g>
                </g>
                <g class="closeIcon" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2">
                    <path class="close-dash tl" d="m15 15 5 5"/>
                    <path class="close-dash tr" d="m25 15-5 5"/>
                    <path class="close-dash br" d="m20 20 5 5"/>
                    <path class="close-dash bl" d="m20 20-5 5"/>
                </g>
                <circle class="donut-ring" cx="20" cy="20" r="19" fill="transparent" stroke-width="3.5"></circle>
                <circle class="donut-segment" cx="20" cy="20" r="19" fill="transparent" stroke-width="3.5" stroke-dasharray="0 120" stroke-dashoffset="30"></circle>
            </svg>
            <span id="completion-info" class="visually-hidden" aria-live="polite"></span>
        `;
        menuBtn.appendChild(menuBtnIcon);
        menuContainer.insertBefore(menuBtn, menuEl);

        new Menu(menuEl);
    }

    const updateScrollWidth = () => {
        requestAnimationFrame(() => {
            document.body.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.offsetWidth) + 'px');
        });
    };
    window.addEventListener('resize', updateScrollWidth);
    document.addEventListener('DOMContentLoaded', updateScrollWidth);
    window.addEventListener('load', updateScrollWidth);
    updateScrollWidth();
};