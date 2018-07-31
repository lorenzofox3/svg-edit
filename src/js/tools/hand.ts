import {DragTool} from './interfaces';
import {Coords, vector, Vector} from '../geometry';

export const hand = ({canvas}): DragTool => {

    let lastPosition: Vector | null = null;
    let origin: Vector | null = null;

    return {
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