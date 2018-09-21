import {ToolBox} from './service';
import {component as fcomp, div, h2, NA} from '../mini-f';

export type ToolBarComponentOptions = {
    el: HTMLElement,
    toolBox: ToolBox
}

const ToolBarComponent = fcomp(() => {
    return div(NA,
        h2(NA, 'Tool bar'),
        div({id: 'tools'})
    );
});

export const toolBarComponent = ({el, toolBox}) => {

    const comp = ToolBarComponent(el, {});

    // const inputs = el.querySelectorAll('[name=tool]');
    //
    // for (const input of inputs) {
    //     input.addEventListener('change', ev => {
    //         const {value} = ev.target;
    //         toolBox.selectTool(value);
    //     });
    // }

    return comp;
};