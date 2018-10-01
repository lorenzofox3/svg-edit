import {HIDDEN_MASK, LOCKED_MASK, Node} from '../svg-document';
import {button, div} from '../mini-f';

const hiddable = (node: Node) => () => node.toggleHide();
const lockable = (node: Node) => () => node.toggleLock();

export const controlBar = (node: Node) => (state = {}) => {
    const isHidden = !!(node.stateFlag & HIDDEN_MASK);
    const isLocked = !!(node.stateFlag & LOCKED_MASK);

    return div({class: 'control-bar'},
        button({
            onclick: hiddable(node),
            role: 'checkbox',
            'aria-checked': String(isHidden),
            'aria-label': isHidden ? 'show' : 'hide'
        }, isHidden ? 's' : 'h'),
        button({
            onclick: lockable(node),
            role: 'checkbox',
            'aria-checked': String(isLocked),
            'aria-label': isLocked ? 'unlock' : 'lock'
        }, isLocked ? 'u' : 'l')
    );
};