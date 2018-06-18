import {events} from './events';

interface ViewBox {
    xmin: number;
    ymin: number;
    width: number;
    height: number;
}

export const canvasComponent = ({el, padding = 40, canvasStore}) => {

    const container = el.parentElement;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    el.appendChild(svg);

    let pixelUnitRatio = 1;
    let viewPortWidth = 100;
    let viewPortHeight = 100;

    const instance = {
        matchViewBox(viewBox: ViewBox) {
            const {width, height} = container.getBoundingClientRect();
            const {width: vbWidth, xmin, ymin, height: vbHeight} = viewBox;

            // 1. use container as "window" on the view box
            const availableWidth = width - padding;
            const availableHeight = height - padding;

            const widthRatio = availableWidth / vbWidth;
            const heightRatio = availableHeight / vbHeight;

            pixelUnitRatio = Math.min(widthRatio, heightRatio);

            const vbPhysicalWidth = vbWidth * pixelUnitRatio;
            const vbPhysicalHeight = vbHeight * pixelUnitRatio;

            el.style.setProperty('width', vbPhysicalWidth + 'px');
            el.style.setProperty('height', vbPhysicalHeight + 'px');

            // 2. Move and scale svg so the "window" match the view box
            svg.style.setProperty('width', pixelUnitRatio * viewPortWidth + 'px');
            svg.style.setProperty('height', pixelUnitRatio * viewPortHeight + 'px');
            svg.style.setProperty('transform', `translateX(${-1 * xmin * pixelUnitRatio}px) translateY(${ -1 * ymin * pixelUnitRatio}px)`);
        }
    };

    el.addEventListener('mousemove', ev => {
        canvasStore.mouseMove(ev);
    });

    canvasStore.on(events.CANVAS_CHANGE, ({width, height}) => {
        viewPortWidth = width;
        viewPortHeight = height;
        svg.setAttribute('width', String(width));
        svg.setAttribute('height', String(height));
    });

    canvasStore.on(events.VIEW_BOX_CHANGE, vb => {
        instance.matchViewBox(vb);
    });

    return instance;
};