import {RectangleDefinition} from './rectangle';
import {EllipseDefinition} from './ellipse';

export const enum Tag {
    RECTANGLE = 'rect',
    ELLIPSE = 'ellipse',
    GROUP = 'g',
    PATH = 'path'
}

export interface SVGElement {
    tag: Tag;
    attributes: RectangleDefinition | EllipseDefinition;
    style?: any; //todo
    state?: any; //todo
}

export const SVG_NS = 'http://www.w3.org/2000/svg';
