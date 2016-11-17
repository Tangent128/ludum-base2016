namespace Applet {

    type KeyName = "up" | "down" | "left" | "right" | "a" | "b" | "menu";

    export interface KeyHandler {
        press?(): void,
        release?(): void,
    };

    /**
     * A set of mappings from keys to game actions;
     * meant to be easy to swap out, so only one
     * of these for each "screen" or "menu" is needed.
     */
    export interface KeyActions {
        up?: KeyHandler;
        down?: KeyHandler;
        left?: KeyHandler;
        right?: KeyHandler;
        a?: KeyHandler;
        b?: KeyHandler;
        menu?: KeyHandler;
    };

    const KEY_NAMES: {[code: number]: KeyName} = {
        // compact keys (WASD+ZXC)
        90: "a",
        88: "b",
        67: "menu",
        87: "up",
        83: "down",
        65: "left",
        68: "right",
        // full-board keys (arrows+space/shift/enter)
        32: "a",
        16: "b",
        13: "menu",
        38: "up",
        40: "down",
        37: "left",
        39: "right",
    };

    /**
     * Utility class to read game input from a DOM element
     * and dispatch it to a KeyActions object. Maintains a
     * stack of KeyActions objects for context.
     */
    export class KeyControl {
        private actionStack: KeyActions[] = [];

        private keyUp = (evt) => {
            this.dispatch(evt, "release");
        };
        private keyDown = (evt) => {
            this.dispatch(evt, "press");
        };

        constructor(private element: HTMLElement, tabindex: number = -1) {
            element.addEventListener("keyup", this.keyUp, false);
            element.addEventListener("keydown", this.keyDown, false);
            element.setAttribute("tabindex", tabindex+"");
        };

        public dispose() {
            this.element.removeEventListener("keyup", this.keyUp, false);
            this.element.removeEventListener("keydown", this.keyDown, false);
        };

        public push(actions: KeyActions) {
            this.actionStack.push(actions);
        };
        public pop() {
            this.actionStack.pop();
        };

        dispatch(evt: KeyboardEvent, state: "press" | "release") {
            let name = KEY_NAMES[evt.which];
            if(name != null && this.actionStack.length > 0) {
                evt.preventDefault();
                evt.stopPropagation();

                let handler: KeyHandler = this.actionStack[this.actionStack.length - 1][name];

                if(state == "press" && handler.press) {
                    handler.press();
                } else if(state == "release" && handler.release) {
                    handler.release();
                }
            }
        };

        public focus() {
            this.element.focus();
        };

    };

    /**
     * A class decorator for automatically constructing
     * class instances around elements on page load.
     */
    export function Bind(selector: string) {
        return (appletType: AppletConstructor) => {
            let elements = document.querySelectorAll(selector);
            for(let i = 0; i < elements.length; i++) {
                let element = elements[i] as HTMLElement;
                new appletType(element);
            }
        }
    };
    export interface AppletConstructor {
        new(element: HTMLElement): any
    };

};
