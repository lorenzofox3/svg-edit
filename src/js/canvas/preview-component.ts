import {events} from './events';

export const previewComponent = ({el, canvasStore}) => {
    const container = el.parentElement;
    const frame = el.querySelector('#zoom-frame');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    el.appendChild(svg);

    let pixelUnitRatio = 1;

    const instance = {};

    canvasStore.on(events.CANVAS_CHANGE, viewPort => {
        const {width: vpWidth, height: vpHeight} = viewPort;
        const {width, height} = container.getBoundingClientRect();
        const availableWidth = width;
        const availableHeight = height;
        const widthRatio = availableWidth / vpWidth;
        const heightRatio = availableHeight / vpHeight;
        pixelUnitRatio = Math.min(widthRatio, heightRatio);
        el.style.width = vpWidth * pixelUnitRatio + 'px';
        el.style.height = vpHeight * pixelUnitRatio + 'px';
    });

    canvasStore.on(events.VIEW_BOX_CHANGE, viewBox => {
        const {width, xmin, ymin, height} = viewBox;
        frame.style.setProperty('--frame-x', xmin * pixelUnitRatio + 'px');
        frame.style.setProperty('--frame-y', ymin * pixelUnitRatio + 'px');
        frame.style.setProperty('--frame-width', width * pixelUnitRatio + 'px');
        frame.style.setProperty('--frame-height', height * pixelUnitRatio + 'px');
    });

    container.addEventListener('mousedown', ev => {
        console.log(ev);
    });

    return instance;
};