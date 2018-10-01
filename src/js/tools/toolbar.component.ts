import {ToolBox} from './toolbox.service';
import {component, ul} from '../mini-f';
import {Tool} from './interfaces';
import {ToolComponent} from './tool.component';

export type ToolBarComponentDependencies = {
    el: HTMLElement,
    toolBox: ToolBox
}

const ToolBarComponent = (toolBox: ToolBox) => component(() => {
    const tools = [...toolBox].map((tool: Tool) => {
        return ToolComponent({tool, toolBox});
    });
    return ul({role: 'toolbar', 'aria-orientation': 'vertical'},
        ...tools);
});

export const toolBarComponent = ({el, toolBox}: ToolBarComponentDependencies) => {
    return ToolBarComponent(toolBox)(el);
};