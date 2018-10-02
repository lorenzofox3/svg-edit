import {magnifierTool} from './magnifier.tool';
import {handTool} from './hand.tool';
import {rectangleTool} from './rectangle.tool';
import {ellipseTool} from './ellipse.tool';
import {events} from '../canvas';
import {Coords} from '../geometry';
import {ClickTool, DragTool, MoveTool, StatefulTool, Tool, ToolType} from './interfaces';
import {fluent} from '../utils';
import {Emitter, emitter} from '../events';
import {ToolBoxEvent} from './events';
import {polygonTool} from './polygon.tool';
import {lineTool} from './line.tool';

export interface ToolBox extends Emitter, Iterable<Tool> {

    selectTool(tool): ToolBox;

    addTool(tool): ToolBox
}

function isClickTool(arg: any): arg is ClickTool {
    return typeof arg.actionClick === 'function';
}

function isDragTool(arg: any): arg is DragTool {
    return typeof arg.actionDrag === 'function';
}

function isMoveTool(arg: any): arg is MoveTool {
    return typeof arg.actionMove === 'function';
}

function isStatefulTool(arg: any): arg is StatefulTool {
    return typeof arg.endAction === 'function';
}

export const toolBox = ({canvas, canvasGuide, document}): ToolBox => {
    const tools: Tool[] = [];
    let selectedTool: Tool = null;

    const instance = Object.assign(emitter(), {
        [Symbol.iterator]() {
            return tools[Symbol.iterator]();
        },
        selectTool: fluent(function (tool: ToolType) {
            if (selectedTool && isStatefulTool(selectedTool)) {
                selectedTool.endAction();
            }
            selectedTool = tools.find(t => t.toolType === tool);
            this.dispatch(ToolBoxEvent.SELECT, selectedTool);
        }),
        addTool: fluent(function (tool: Tool) {
            tools.push(tool);
            this.dispatch(ToolBoxEvent.ADD, tool);
        })
    });

    instance
        .addTool(magnifierTool({canvas, canvasGuide}))
        .addTool(handTool({canvas}))
        .addTool(rectangleTool({canvasGuide, document}))
        .addTool(ellipseTool({canvasGuide, canvas, document}))
        .addTool(polygonTool({canvasGuide, document}))
        .addTool(lineTool({canvasGuide, document}));


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

    canvas.on(events.MOUSE_MOVE, (p: Coords, event: MouseEvent) => {
        if (isMoveTool(selectedTool)) {
            selectedTool.actionMove(p, event);
        }
    });

    canvas.on(events.KEY_DOWN, (ev: KeyboardEvent) => {
        const {key} = ev;
        if (isStatefulTool(selectedTool) && (key === 'Escape' || key === 'Enter')) {
            selectedTool.endAction();
        }
    });

    instance.selectTool(ToolType.ELLIPSE);

    return instance;
};