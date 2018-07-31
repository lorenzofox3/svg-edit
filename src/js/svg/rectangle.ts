import {Tag} from './utils';

export interface RectangleDefinition {
    x: number,
    y: number,
    width: number,
    height: number
}

export const rectangle = (input: RectangleDefinition) => {
    const instance = {};
    Object.defineProperties(instance, {attributes: {value: input}, tag: {value: Tag.RECTANGLE}});
    return instance;
};