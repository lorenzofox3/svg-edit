import {ToolBox} from './toolbox.service';
import {Tool} from './interfaces';
import {button, li, NA} from '../mini-f';

type ToolComponentDependencies = {
    tool: Tool,
    toolBox: ToolBox
};

export const ToolComponent = ({tool, toolBox}: ToolComponentDependencies) => {
    return li(NA, button({
        class: 'tool',
        onclick: () => toolBox.selectTool(tool.toolType)
    }, tool.toolType));
};