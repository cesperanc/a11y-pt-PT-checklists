class MenuA11y {
    #domNode = null;
    #popups = [];
    #firstChars = {};
    #firstMenuItem = {};
    #lastMenuItem = {};
    #menuItemGroups = {};

    constructor(node) {
        this.#domNode = node;

        this.#init(this.#domNode);
    }

    #getMenuItems(menu) {
        const nodes = [];
        let node = menu.firstElementChild;
        while (!!node) {
            switch (node.getAttribute('role')) {
                case 'menuitem':
                    if (node.getAttribute('aria-haspopup') === 'true') {
                        this.#popups.push(node);
                    }
                    nodes.push(node);
                    break;
            }
            node = node.nextElementSibling;
        }

        return nodes;
    }

    #init(menu) {
        const menuItems = this.#getMenuItems(menu);
        const menuId = menu.getAttribute('id');

        this.#firstChars[menuId] = [];
        this.#firstMenuItem[menuId] = menuItems.length > 0 ? menuItems[0] : null;
        this.#lastMenuItem[menuId] = menuItems.length > 0 ? menuItems[menuItems.length - 1] : null;
        this.#menuItemGroups[menuId] = [];

        for (let i = 0; i < menuItems.length; i++) {
            const menuItem = menuItems[i];
            const role = menuItem.getAttribute('role');

            if (role.indexOf('menuitem') < 0) {
                continue;
            }
            // menuItem.tabIndex = -1;
            this.#menuItemGroups[menuId].push(menuItem);

            // this.#firstChars[menuId].push(menuItem.textContent[0].toLowerCase());

            menuItem.addEventListener('keydown', this.#onKeyDown.bind(this));

            if (this.#hasPopup(menuItem)) {
                menuItem.tabIndex = 0;
            }
        }
    }

    #getMenu(menuItem) {
        let menu = menuItem;

        while (!!menu && menu.getAttribute('role') !== 'menu') {
            menu = menu.parentNode;
        }

        return menu;
    }

    #hasPopup(menuItem) {
        return menuItem.getAttribute('aria-haspopup') === 'true';
    }

    #isOpen(menuItem) {
        return menuItem.getAttribute('aria-expanded') === 'true';
    }

    #isAnyPopupOpen() {
        for (var i = 0; i < this.#popups.length; i++) {
            if (this.#isOpen(this.#popups[i])) {
                return true;
            }
        }
        return false;
    }

    #closePopups(menuItem) {
        if (typeof menuItem !== 'object') {
            menuItem = false;
        }

        for (let i = 0; i < this.#popups.length; i++) {
            const popup = this.#popups[i];
            if (this.#isOpen(popup) && !popup.nextElementSibling.contains(menuItem)) {
                this.#closePopup(popup);
            }
        }
    }

    #closePopup(menuItem) {
        if (this.#hasPopup(menuItem)) {
            if (this.#isOpen(menuItem)) {
                menuItem.setAttribute('aria-expanded', 'false');
            }
            return menuItem;
        } else {
            const menu = this.#getMenu(menuItem);
            menu.setAttribute('aria-expanded', 'false');
            const menuTriggerEl = document.querySelector(`[aria-controls="${(menu.getAttribute('id'))}"]`);
            if(!!menuTriggerEl){
                menuTriggerEl.dispatchEvent(new Event('click'));
                requestAnimationFrame(()=>{
                    menuTriggerEl.focus();
                });
            }else{
                menu.focus();
            }
            return menu;
        }
    }

    #openPopup(menuItem) {
        menuItem.setAttribute('aria-expanded', 'true');

        return menuItem.nextElementSibling.getAttribute('id');
    }

    #setFocusToMenuItem(menuId, newMenuitem) {
        const isAnyPopupOpen = this.#isAnyPopupOpen();

        this.#closePopups(newMenuitem);

        if (this.#hasPopup(newMenuitem)) {
            if (isAnyPopupOpen) {
                this.#openPopup(newMenuitem);
            }
        } else {
            const menu = this.#getMenu(newMenuitem);
            const menuPreviousSibling = menu.previousElementSibling;
            if (!this.#isOpen(menuPreviousSibling)) {
                this.#openPopup(menuPreviousSibling);
            }
        }

        if (this.#hasPopup(newMenuitem)) {
            if (this.#menuItemGroups[menuId]) {
                this.#menuItemGroups[menuId].forEach((item) => {
                    item.tabIndex = -1;
                });
            }
            newMenuitem.tabIndex = 0;
        }

        newMenuitem.focus();
    }

    #setFocusToFirstMenuItem(menuId) {
        this.#setFocusToMenuItem(menuId, this.#firstMenuItem[menuId]);
    }

    #setFocusToLastMenuItem(menuId) {
        this.#setFocusToMenuItem(menuId, this.#lastMenuItem[menuId]);
    }

    #setFocusToPreviousMenuItem(menuId, currentMenuitem) {
        let newMenuitem;

        if (currentMenuitem === this.#firstMenuItem[menuId]) {
            newMenuitem = this.#lastMenuItem[menuId];
        } else {
            newMenuitem = this.#menuItemGroups[menuId][this.#menuItemGroups[menuId].indexOf(currentMenuitem) - 1];
        }

        this.#setFocusToMenuItem(menuId, newMenuitem);

        return newMenuitem;
    }

    #setFocusToNextMenuItem(menuId, currentMenuitem) {
        let newMenuitem;

        if (currentMenuitem === this.#lastMenuItem[menuId]) {
            newMenuitem = this.#firstMenuItem[menuId];
        } else {
            newMenuitem = this.#menuItemGroups[menuId][this.#menuItemGroups[menuId].indexOf(currentMenuitem) + 1];
        }

        this.#setFocusToMenuItem(menuId, newMenuitem);

        return newMenuitem;
    }

    #getIndexFirstChars(menuId, startIndex, char) {
        for (let i = startIndex; i < this.#firstChars[menuId].length; i++) {
            if (char === this.#firstChars[menuId][i]) {
                return i;
            }
        }
        return -1;
    }

    #setFocusByFirstCharacter(menuId, currentMenuitem, char) {
        let start, index;

        char = char.toLowerCase();

        // Get start index for search based on position of currentItem
        start = this.#menuItemGroups[menuId].indexOf(currentMenuitem) + 1;
        if (start >= this.#menuItemGroups[menuId].length) {
            start = 0;
        }

        // Check remaining slots in the menu
        index = this.#getIndexFirstChars(menuId, start, char);

        // If not found in remaining slots, check from beginning
        if (index === -1) {
            index = this.#getIndexFirstChars(menuId, 0, char);
        }

        // If match was found...
        if (index > -1) {
            this.#setFocusToMenuItem(menuId, this.#menuItemGroups[menuId][index]);
        }
    }

    #onKeyDown(event) {
        const target = event.currentTarget;
        console.log(this.#getMenu(target));
        const menuId = this.#getMenu(target).getAttribute('id');
        const key = event.key;
        let handled = false;

        switch (key) {
            case 'Esc':
            case 'Escape':
                this.#closePopup(target);
                handled = true;
                break;

            case ' ':
            case 'Enter':
                if (this.#hasPopup(target)) {
                    this.#setFocusToFirstMenuItem(this.#openPopup(target));
                } else {
                    target.dispatchEvent(new Event('click'));
                    //this.#closePopup(target);
                }
                handled = true;
                break;

            case 'ArrowDown':
            case 'Down':
                this.#setFocusToFirstMenuItem(menuId);
                handled = true;
                break;

            case 'Up':
            case 'ArrowUp':
                this.#setFocusToLastMenuItem(menuId);
                handled = true;
                break;

            case 'Left':
            case 'ArrowLeft':
                this.#setFocusToPreviousMenuItem(menuId, target);
                handled = true;
                break;

            case 'Right':
            case 'ArrowRight':
                this.#setFocusToNextMenuItem(menuId, target);
                handled = true;
                break;

            case 'Home':
            case 'PageUp':
                this.#setFocusToFirstMenuItem(menuId, target);
                handled = true;
                break;

            case 'End':
            case 'PageDown':
                this.#setFocusToLastMenuItem(menuId, target);
                handled = true;
                break;

            case 'Tab':
                //this.#closePopup(menuId);
                break;

            default:
                if (key.length === 1 && key.match(/\S/)) {
                    this.#setFocusByFirstCharacter(menuId, target, key);
                    handled = true;
                }
                break;
        }

        if (handled) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
}

export default MenuA11y;