import {Coords} from '../geometry';

export const toolType = Symbol('property to get the tool type');

export const enum ToolType {
    MAGNIFIER = 'magnifier',
    HAND = 'hand',
    ELLIPSE = 'ellipse',
    RECTANGLE = 'rectangle'
}

// todo use symbole instead
export interface Tool {
    toolType: ToolType;
}

export interface ClickTool extends Tool {
    actionClick(point: Coords, event: MouseEvent);

    alternateActionClick(point: Coords, event: MouseEvent);
}

export interface DragTool extends Tool {
    actionDragStart(point: Coords, event: DragEvent);

    actionDrag(point: Coords, event: DragEvent);

    actionDragEnd(point: Coords, event: DragEvent);
}


