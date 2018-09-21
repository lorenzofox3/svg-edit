import {DragTool, ToolType} from './interfaces';
import {Coords, vector, Vector} from '../geometry';
import {Canvas} from '../canvas';

type HandToolDependencies = {
    canvas: Canvas;
}

export const handTool = ({canvas}: HandToolDependencies): DragTool => {

    let lastPosition: Vector | null = null;
    let origin: Vector | null = null;

    return {
        toolType: ToolType.HAND,
        actionDragStart(point: Coords, event) {
            origin = lastPosition = vector(point);
        },
        actionDrag(point: Coords, event) {
            if (lastPosition.distance(vector(point)) > 2) {
                const newPosition = vector(point);
                const vect = lastPosition.substract(newPosition);
                lastPosition = newPosition;
                canvas.pane(vect.multiply(0.7)); // Avoid acceleration due to the movement of the origin : todo correct equations when reference changes
            }
        },
        actionDragEnd(point: Coords, event) {
            lastPosition = null;
            origin = null;
        }
    };
};