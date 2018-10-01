import {Coords} from '../geometry';

export const toolType = Symbol('property to get the tool type');

export const enum ToolType {
    MAGNIFIER = 'magnifier',
    HAND = 'hand',
    ELLIPSE = 'ellipse',
    RECTANGLE = 'rectangle',
    SELECTION = 'selection',
    POLYGON = 'polygon'
}

export interface Tool {
    readonly toolType: ToolType;
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

export interface StatefullTool extends Tool {
    cancelAction();

    endAction()
}

export interface MoveTool extends Tool {
    actionMove(point: Coords, event: MouseEvent);
}


