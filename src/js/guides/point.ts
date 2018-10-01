import {ElementWrapper, poolProvider} from './pool';
import {SVG_NS} from '../mini-f';
import {fluent} from '../utils';

export interface Point {
    x(x: number): Point;

    y(y: number): Point;
}

const prototype = {
    x: fluent(function (x: number) {
        this.el.setAttribute('cx', String(x));
    }),
    y: fluent(function (y: number) {
        this.el.setAttribute('cy', String(y));
    })
};

export type DOMPoint = Point & ElementWrapper;

const point = (): DOMPoint => {
    const el = document.createElementNS(SVG_NS, 'circle');
    el.setAttribute('vector-effect', 'non-scaling-stroke');
    el.setAttribute('stroke-width', '1px');
    el.setAttribute('stroke', 'blue');
    el.setAttribute('fill', 'blue');
    el.setAttribute('r', '5px');

    return Object.create(prototype, {
        el: {value: el}
    });
};

export const pointPoolFactory = poolProvider(point);