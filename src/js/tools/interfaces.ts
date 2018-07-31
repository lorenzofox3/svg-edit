import {Coords} from '../geometry';

export interface Tool {
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
