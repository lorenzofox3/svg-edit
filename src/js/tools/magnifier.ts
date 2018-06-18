import {ClickTool} from './interfaces';
import {Coords} from "../shapes";

export const magnifier = ({canvas}): ClickTool => {
    return {
        actionClick(point: Coords, event: MouseEvent) {
            canvas.zoomIn(point);
        },
        alternateActionClick(point: Coords, event: MouseEvent) {
            canvas.zoomOut(point);
        }

    };
};