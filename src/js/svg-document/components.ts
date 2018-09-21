import {Node} from './index';
import {component as fcomp} from '../mini-f';

export const component = template => (node: Node, el, initialState = {}) =>
    fcomp((state, update) => template(node, state, update))(el, initialState);
