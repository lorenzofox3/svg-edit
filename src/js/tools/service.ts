import {magnifier} from './magnifier';
import {hand} from './hand';
import {rectangleTool} from './rectangle';
import {ellipseTool} from './ellipse';
import {events} from '../canvas';
import {Coords} from '../geometry';
import {ClickTool, DragTool, Tool} from "./interfaces";

interface ToolBox {
    selectTool(tool): ToolBox;
}

function isClickTool(arg: any): arg is ClickTool {
    return typeof arg.actionClick === 'function';
}

function isDragTool(arg: any): arg is DragTool {
    return typeof arg.actionDrag === 'function';
}

export const toolBox = ({canvas, canvasGuide, document}): ToolBox => {
    const tools: Tool[] = [
        magnifier({canvas}),
        hand({canvas}),
        rectangleTool({canvasGuide, canvas, document}),
        ellipseTool({canvasGuide, canvas, document})
    ];
    let selectedTool = tools[3];

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

    return {
        selectTool(tool) {
            selectedTool = tools.find(t => t === tool);
            return this;
        }
    };
};