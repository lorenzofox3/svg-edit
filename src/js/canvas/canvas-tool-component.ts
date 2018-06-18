import {Canvas} from './canvas';
import {events} from './events';
import {Emitter} from '../events';

interface CanvasToolComponentInput {
    el: HTMLElement,
    canvas: Canvas & Emitter
}


type CanvasToolInput = CanvasToolComponentInput;

const enum methodName {
    setCanvas = 'setCanvas',
    setViewBox = 'setViewBox'
}


export const canvasToolComponent = (input: CanvasToolInput) => {
    const {el, canvas} = input;
    // const widthInput = <HTMLInputElement>el.querySelector('[name=width]');
    // const heightInput = <HTMLInputElement>el.querySelector('[name=height]');
    const xminInput = <HTMLInputElement>el.querySelector('[name=xmin]');
    const yminInput = <HTMLInputElement>el.querySelector('[name=ymin]');
    const vbwidthInput = <HTMLInputElement>el.querySelector('[name=vbwidth]');
    const vbheightInput = <HTMLInputElement>el.querySelector('[name=vbheight]');


    // canvas.on(events.CANVAS_CHANGE, ({width, height}) => {
    //     widthInput.value = width;
    //     heightInput.value = height;
    // });

    canvas.on(events.VIEW_BOX_CHANGE, ({xmin, ymin, width, height}) => {
        xminInput.value = xmin;
        yminInput.value = ymin;
        vbwidthInput.value = width;
        vbheightInput.value = height;
    });

    const setListener = (propName: string, method: methodName) => ev => {
        const {value} = <HTMLInputElement>ev.target;
        canvas[<string>method]({[propName]: Number(value)});
    };

    // widthInput.addEventListener('blur', setListener('width', methodName.setCanvas));
    // heightInput.addEventListener('blur', setListener('height', methodName.setCanvas));
    xminInput.addEventListener('blur', setListener('xmin', methodName.setViewBox));
    yminInput.addEventListener('blur', setListener('ymin', methodName.setViewBox));
    vbwidthInput.addEventListener('blur', setListener('width', methodName.setViewBox));
    vbheightInput.addEventListener('blur', setListener('height', methodName.setViewBox));
};