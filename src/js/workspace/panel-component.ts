import {panel, PanelInput} from './panel';

interface ElementInput {
    el: HTMLElement
}

type CanvasToolPanel = PanelInput & ElementInput;

export const canvasToolPanel = (input: CanvasToolPanel) => {
    const {el} = input;
    const comp = panel(input);
    const toggle = el.querySelector('[aria-haspopup]');
    const content = el.querySelector('.panel-content');
    comp.onChange('open', ({open}) => {
        el.classList.remove('collapsed');
        content.setAttribute('aria-hidden', String(open === false));
        toggle.setAttribute('aria-expanded', String(open));
        if (open === false) {
            el.classList.add('collapsed');
        }
    });

    toggle.addEventListener('click', () => comp.toggle());

    return comp;
};