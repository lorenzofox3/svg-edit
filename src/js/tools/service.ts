import {magnifierTool} from './magnifier';
import {handTool} from './hand';
import {rectangleTool} from './rectangle';
import {ellipseTool} from './ellipse';
import {events} from '../canvas';
import {Coords} from '../geometry';
import {ClickTool, DragTool, Tool, ToolType} from './interfaces';
import {fluent} from '../utils';
import {Emitter, emitter} from '../events';
import {ToolBoxEvent} from './events';

export interface ToolBox extends Emitter {
    selectTool(tool): ToolBox;

    addTool(tool): ToolBox
}

function isClickTool(arg: any): arg is ClickTool {
    return typeof arg.actionClick === 'function';
}

function isDragTool(arg: any): arg is DragTool {
    return typeof arg.actionDrag === 'function';
}

export const toolBox = ({canvas, canvasGuide, document}): ToolBox => {
    const tools: Tool[] = [];
    let selectedTool: Tool = null;

    const instance = Object.assign(emitter(), {
        selectTool: fluent(function (tool: ToolType) {
            selectedTool = tools.find(t => t.toolType === tool);
            this.dispatch(ToolBoxEvent.SELECT, selectedTool);
        }),
        addTool: fluent(function (tool: Tool) {
            tools.push(tool);
            this.dispatch(ToolBoxEvent.ADD, tool);
        })
    });

    instance
        .addTool(magnifierTool({canvas}))
        .addTool(handTool({canvas}))
        .addTool(rectangleTool({canvasGuide, document}))
        .addTool(ellipseTool({canvasGuide, canvas, document}));


    canvas.on(events.MOUSE_CLICK, (p: Coords, event: MouseEvent) => {
        const {altKey} = event;
        if (isClickTool(selectedTool)) {
            if (altKey) {
                selectedTool.alternateActionClick(p, event);
            } else {
                selectedTool.actionClick(p, event);
            }
        }
    });

    canvas.on(events.MOUSE_DRAG_START, (p: Coords, event: DragEvent) => {
        if (isDragTool(selectedTool)) {
            selectedTool.actionDragStart(p, event);
        }
    });

    canvas.on(events.MOUSE_DRAG, (p: Coords, event: DragEvent) => {
        if (isDragTool(selectedTool)) {
            selectedTool.actionDrag(p, event);
        }
    });

    canvas.on(events.MOUSE_DRAG_END, (p: Coords, event: DragEvent) => {
        if (isDragTool(selectedTool)) {
            selectedTool.actionDragEnd(p, event);
        }
    });

    instance.selectTool(ToolType.ELLIPSE);

    return instance;
};