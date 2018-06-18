import {emitter as stEmitter} from 'smart-table-events';

export interface Emitter {
    on(event: string, ...listeners: Function[]): Emitter;

    off(event: string, ...listeners: Function[]): Emitter;

    dispatch(event, ...args: any[]): Emitter;
}

export const emitter = (): Emitter => <Emitter>stEmitter();