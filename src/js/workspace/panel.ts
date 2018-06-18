import {WorkspaceStore} from './index';
import {emitter, Emitter} from '../events';
import {events} from './events';

export interface Panel {
    onChange(props: string, callback: Function): Panel;

    open(): Panel;

    close(): Panel;

    toggle(): Panel;

    isOpen(): boolean;
}

export interface PanelInput {
    open?: boolean;
    workspace: WorkspaceStore & Emitter;
}

export const panel = (input: PanelInput): Panel => {
    let {open = true} = input;
    const {workspace} = input;
    const event = emitter();

    const instance = {
        onChange(prop, callback) {
            event.on(prop, callback);
            return this;
        },
        open() {
            workspace.openPanel(this);
            return this;
        },
        close() {
            workspace.closePanel(this);
            return this;
        },
        toggle() {
            workspace.togglePanel(this);
            return this;
        },
        isOpen() {
            return open;
        }
    };

    workspace.on(events.PANEL_OPEN_CHANGE, payload => {
        if (payload.panel === instance) {
            open = payload.open;
        }
        event.dispatch('open', {open});
    });


    return instance;
};