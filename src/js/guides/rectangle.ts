import {ElementWrapper, poolProvider} from './pool';
import {SVG_NS} from '../mini-f';
import {fluent} from '../utils';

export interface Rectangle {
    width(width: number): Rectangle;

    x(x: number): Rectangle;

    y(x: number): Rectangle;

    height(height: number): Rectangle;
}

const prototype = {
    width: fluent(function (width: number) {
        this.el.setAttribute('width', String(width));
    }),
    height: fluent(function (height: number) {
        this.el.setAttribute('height', String(height));
    }),
    x: fluent(function (width: number) {
        this.el.setAttribute('x', String(width));
    }),
    y: fluent(function (width: number) {
        this.el.setAttribute('y', String(width));
    })
};

export type DomRectangle = Rectangle & ElementWrapper;

const rectangle = (): DomRectangle => {
    const el = document.createElementNS(SVG_NS, 'rect');
    el.setAttribute('vector-effect', 'non-scaling-stroke');
    el.setAttribute('stroke-width', '1px');
    el.setAttribute('stroke', 'blue');

    return Object.create(prototype, {
        el: {value: el}
    });
};

export const rectanglePoolFactory = poolProvider(rectangle);