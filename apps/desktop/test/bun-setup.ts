import { cleanup } from '@testing-library/react';
import * as jestDomMatchers from '@testing-library/jest-dom/matchers';
import { JSDOM } from 'jsdom';
import { afterEach, expect } from 'vitest';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost/',
});

const win = dom.window as unknown as Window & typeof globalThis;

globalThis.window = win;
globalThis.document = win.document;
globalThis.navigator = win.navigator;
globalThis.HTMLElement = win.HTMLElement;
globalThis.Node = win.Node;
globalThis.Event = win.Event;
globalThis.KeyboardEvent = win.KeyboardEvent;
globalThis.MouseEvent = win.MouseEvent;
globalThis.getComputedStyle = win.getComputedStyle.bind(win);
globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 0) as unknown as number;
globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id as unknown as NodeJS.Timeout);

if (!('matchMedia' in win)) {
    win.matchMedia = (() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false,
    })) as any;
}

if (!('localStorage' in globalThis)) {
    Object.defineProperty(globalThis, 'localStorage', {
        value: win.localStorage,
        writable: false,
    });
}

if (!('sessionStorage' in globalThis)) {
    Object.defineProperty(globalThis, 'sessionStorage', {
        value: win.sessionStorage,
        writable: false,
    });
}

// React's input event polyfill expects these legacy hooks in some environments.
if (!(win.HTMLElement.prototype as any).attachEvent) {
    (win.HTMLElement.prototype as any).attachEvent = () => { };
}
if (!(win.HTMLElement.prototype as any).detachEvent) {
    (win.HTMLElement.prototype as any).detachEvent = () => { };
}

// Make `expect` global so matcher libs can extend it.
(globalThis as any).expect = expect;
expect.extend(jestDomMatchers);

afterEach(() => {
    cleanup();
});

// jsdom's canvas throws; axe may touch it.
if (win.HTMLCanvasElement) {
    Object.defineProperty(win.HTMLCanvasElement.prototype, 'getContext', {
        value: (() => null) as any,
        configurable: true,
    });
}

// React Testing Library uses this to silence act warnings.
// See: https://react.dev/reference/react/act#setting-up-your-environment-for-act
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

