import {emitter, Emitter} from '../events';
import {events} from './events';
import {Coords, Vector, vector} from '../geometry';
import {fluent} from '../utils';

export interface ViewPort {
    width: number;
    height: number;
}

export interface ViewBox {
    xmin: number,
    ymin: number,
    width: number,
    height: number,
}

export interface Canvas {
    pixelByUnit: number;

    matchViewBox(viewbox: ViewBox): Canvas;

    zoom(ratio: number, zoomCenter?: Coords): Canvas;

    zoomIn(center ?: Coords): Canvas;

    zoomOut(center ?: Coords): Canvas;

    fitContent(): Canvas;

    pane(dir: Vector): Canvas;
}

const padding = 20;
const zoomRatios = [0.2, 0.4, 0.5, 0.8, 1, 1.2, 1.5, 2, 4, 8, 10];
const svgBorder = 1;

export const CanvasService = ({document: root, el}): Canvas & Emitter => {
    const physicalCanvas = el.querySelector('#canvas');
    const svg = el.querySelector('#document');

    const viewBox: ViewBox = {
        xmin: 0,
        ymin: 0,
        width: root.width,
        height: root.height
    };

    let mouseDown = false;
    let dragging = false;
    let pixelByUnit = 1;
    let center = {
        x: root.width / 2,
        y: root.height / 2
    };

    const getPhysicalLength = (): ViewPort => {
        const {width: elWidth, height: elHeight} = el.getBoundingClientRect();
        return {
            width: elWidth - padding,
            height: elHeight - padding
        };
    };

    const instance = Object.assign(emitter(), {
        getCoordinates(physicalX: number, physicalY: number) {
            const {x, y} = physicalCanvas.getBoundingClientRect();
            return vector(viewBox.xmin, viewBox.ymin).add(vector((physicalX - x) / pixelByUnit, (physicalY - y) / pixelByUnit));
        },
        zoom: fluent(function (ratio: number, zoomCenter?: Coords) {
            const {width: physicalWidth, height: physicalHeight} = getPhysicalLength();
            center = zoomCenter !== undefined ? zoomCenter : center;

            pixelByUnit = ratio;

            viewBox.width = physicalWidth / pixelByUnit;
            viewBox.height = physicalHeight / pixelByUnit;

            const cornerTopLeft = vector(center)
                .add(vector(-viewBox.width / 2, -viewBox.height / 2));

            viewBox.xmin = cornerTopLeft.x;
            viewBox.ymin = cornerTopLeft.y;

            svg.style.setProperty('width', root.width * pixelByUnit + 'px');
            svg.style.setProperty('height', root.height * pixelByUnit + 'px');
            physicalCanvas.style.setProperty('width', viewBox.width * pixelByUnit + 'px');
            physicalCanvas.style.setProperty('height', viewBox.height * pixelByUnit + 'px');
            svg.style.setProperty('transform', `translateX(${-1 * viewBox.xmin * pixelByUnit}px) translateY(${ -1 * viewBox.ymin * pixelByUnit}px)`);

            this.dispatch(events.VIEW_BOX_CHANGE, Object.assign({}, viewBox));
        }),

        matchViewBox(viewbox: ViewBox) {
            const {width: physicalWidth, height: physicalHeight} = getPhysicalLength();
            const ratio = Math.min(physicalHeight / viewbox.height, physicalWidth / viewbox.width);
            const center = {x: viewbox.xmin + viewbox.width / 2, y: viewbox.ymin + viewbox.height / 2};
            return this.zoom(ratio, center);
        },

        zoomIn(zoomCenter = center) {
            const ratio = zoomRatios.find(r => r > pixelByUnit) || zoomRatios[zoomRatios.length - 1];
            return this.zoom(ratio, zoomCenter);
        },

        pane(vect: Vector) {
            return this.zoom(pixelByUnit, vector(center).add(vect));
        },

        zoomOut(zoomCenter = center) {
            const ratioIndex = zoomRatios.findIndex(r => r >= pixelByUnit);
            const ratio = zoomRatios[ratioIndex - 1] || zoomRatios[0];
            return this.zoom(ratio, zoomCenter);
        },

        fitContent() {
            const {width: physicalWidth, height: physicalHeight} = getPhysicalLength();
            const zoomRatio = Math.min((physicalWidth - svgBorder * 2) / root.width, (physicalHeight - svgBorder * 2) / root.height);
            const canvasCenter = {x: root.width / 2, y: root.height / 2};
            return this.zoom(zoomRatio, canvasCenter);
        }
    });

    Object.defineProperty(instance, 'pixelByUnit', {
        get() {
            return pixelByUnit;
        }
    });

    let origin = null;

    physicalCanvas.addEventListener('mousedown', ev => {
        origin = instance.getCoordinates(ev.clientX, ev.clientY);
        mouseDown = true;
    });

    physicalCanvas.addEventListener('mouseup', ev => {
        const coords = instance.getCoordinates(ev.clientX, ev.clientY);
        const event = dragging ? events.MOUSE_DRAG_END : events.MOUSE_CLICK;
        instance.dispatch(event, coords, ev);
        mouseDown = false;
        dragging = false;
        origin = null;
    });

    physicalCanvas.addEventListener('mousemove', ev => {
        const coords = instance.getCoordinates(ev.clientX, ev.clientY);
        if (mouseDown) {
            const event = dragging ? events.MOUSE_DRAG : events.MOUSE_DRAG_START;
            instance.dispatch(event, dragging ? coords : origin, ev);
            dragging = true;
        } else {
            instance.dispatch(events.MOUSE_MOVE, coords, ev);
        }
    });

    physicalCanvas.addEventListener('keydown', ev => {
        instance.dispatch(events.KEY_DOWN, ev);
    });

    // @ts-ignore
    return instance;
};