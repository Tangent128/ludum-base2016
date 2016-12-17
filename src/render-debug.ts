/// <reference path="ecs.ts" />
/// <reference path="render.ts" />
/// <reference path="ecs-common.ts" />

namespace RenderDebug {

    export var showDebug = false;

    export class Box implements Render.Renderer {

        constructor(
            public bounds: Render.Box,
            public color = "#f00"
        ) {};

        public render(cx: CanvasRenderingContext2D) {
            if(showDebug) {
                let b = this.bounds;
                cx.fillStyle = this.color;
                cx.fillRect(b.x, b.y, b.w, b.h);
            }
        };
    };

};
