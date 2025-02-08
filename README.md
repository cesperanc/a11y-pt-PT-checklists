# Forms for Usability and Accessibility Verification Lists 

[![License: GPL v3+](https://img.shields.io/badge/License-GPL%20v3%2B-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

This project provides some forms to evaluate the accessibility and usability of websites accordingly to the [Usability and Accessibility verification lists](https://amagovpt.github.io/kit-selo/checklists/) promoted by [AMA](https://www.acessibilidade.gov.pt/). 

These forms can be used directly by visiting [cesperanc.github.io/a11y-pt-PT-checklists/](https://cesperanc.github.io/a11y-pt-PT-checklists/). The project is also opensource, so you can fork it and customize it to fit your own needs and requirements. 

## Features
* Minimal branding and you can update/replace the logo by clicking on it (or dragging your own logo over the logo area), when filling out a form; 
* Gallery view with support to magnify/pan images using your mouse or keyboard (Ctrl+plus, Ctrl+minus, arrow keys, Esc). Drag and drop support is also there; 
* Print friendly (you should be able to print the form directly to PDF using the browser tools); 
* You can export the form to a JSON format and import the file later on, to resume your work. If you want smaller files, you can use gzip to compress the files (uncomment the line `//import * as fflate from 'https://cdn.skypack.dev/fflate?min';` in the `assets/scripts/App.js` file in your own fork); 
* We rely on the History API to keep the form state. Unfortunely there are size restrictions on this API, so Fact/Evidence images state can not be kept (so you'll have to rely on the export/import functionality between work sessions); 
* Keyboard friendly, so you should be able to use all the features without having to rely on a pointer device; 
* Screen reader friendly, tested by multiple users with various configurations (NVDA+Chrome+Windows, NVDA+Firefox+Windows, JAWS+Chrome+Windows, ORCA+Chromium+KDE+Linux, ORCA+Firefox+KDE+Linux, Talkback+Chrome+Android+Pixel Device, Talkback+Firefox+Android+Pixel Device, Talkback+Chrome+Android+Xiaomi Device);
* Built for customization, so if you want to have your own checklist, duplicate a `checklist-*.html` index file and its corresponding `checklist-*.js` data file, update the index file to point to the new data file (look for the `import Config from "./checklist-*.js";` line), and update the data file with your own groups and tests; 
* We believe in open standards, so we only used vanila HTML, JavaScript and CSS (no frameworks, no transpiling and no black boxes); 
* Your data is safe. It works only on client side so no data is stored in the Cloud.

## Where can I test it

[cesperanc.github.io/a11y-pt-PT-checklists/](https://cesperanc.github.io/a11y-pt-PT-checklists/)


## With the amazing contributions of: 

* [Cláudio Esperança](https://www.linkedin.com/in/cesperanca/) as the Engineer
* [Joana Mineiro](https://www.linkedin.com/in/joanamineiro/) as the UX Designer
* [Manuela Francisco](https://www.linkedin.com/in/manuela-francisco/) as the Accessibility Designer
* [Norberto Sousa](https://comacesso.pt/) as the Accessibility Expert and Auditor
* [Vitor Rodrigues](https://www.linkedin.com/in/vitor-rodrigues-a176a08a/) as the Boss
* [Victoria Santos](https://github.com/VictoriaMoraisSantos) as a contributor
