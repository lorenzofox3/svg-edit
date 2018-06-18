import {DragTool} from './interfaces';
import {Coords, vector, Vector} from '../shapes';

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
                const vect = newPosition.substract(lastPosition);
                lastPosition = newPosition;
                canvas.pane(vect.multiply(0.7)); // Avoid acceleration
            }
        },
        actionDragEnd(point: Coords, event) {
            lastPosition = null;
            origin = null;
        }
    };
};


// 0478007778