import {emitter, Emitter} from '../events';
import {Panel} from './panel';
import {events} from './events';

export interface WorkspaceStore {
    addPanel(panel: Panel): WorkspaceStore;

    togglePanel(panel: Panel): WorkspaceStore;

    closePanel(panel: Panel): WorkspaceStore;

    openPanel(panel: Panel): WorkspaceStore;
}

export const store = (): WorkspaceStore & Emitter => {
    const state = new WeakMap();

    return Object.assign(emitter(), {
        addPanel(panel) {
            state.set(panel, {open: panel.isOpen});
            return this;
        },
        closePanel(panel) {
            if (!state.has(panel)) {
                throw new Error('could not find the related panel');
            }
            state.set(panel, {open: false});
            this.dispatch(events.PANEL_OPEN_CHANGE, {panel, open: false});
            return this;
        },
        togglePanel(panel) {
            if (!state.has(panel)) {
                throw new Error('could not find the related panel');
            }
            const current = state.get(panel);
            const newState = {open: !current.open};
            state.set(panel, newState);
            this.dispatch(events.PANEL_OPEN_CHANGE, {panel, open: newState.open});
            return this;
        },
        openPanel(panel) {
            if (!state.has(panel)) {
                throw new Error('could not find the related panel');
            }
            state.set(panel, {open: true});
            this.dispatch(events.PANEL_OPEN_CHANGE, {panel, open: true});
            return this;
        }
    });
};