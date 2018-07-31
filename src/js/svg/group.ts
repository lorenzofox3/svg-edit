import {element} from './element';

export const group = () => {
    return Object.create(element, {children: {value: []}, tag: {value: 'g'}});
};