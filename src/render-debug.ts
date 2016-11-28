/// <reference path="ecs.ts" />
/// <reference path="render.ts" />

namespace RenderDebug {

    export class Box implements Render.Renderable {
        constructor(
            public Layer: Render.Layer,
            public bounds: Render.Box,
            public color = "#f00"
        ) {};

        public render(cx: CanvasRenderingContext2D) {
            let b = this.bounds;
            cx.fillStyle = this.color;
            cx.fillRect(b.x, b.y, b.w, b.h);
        };
    };

    export interface HasBox {
        RenderDebugBox: Box
    };
    export function HasBox(item: any): item is HasBox {
        return item.RenderDebugBox != null;
    };

    export class System extends ECS.System<HasBox> {
        constructor(
            public renderer: Render.RenderList
        ) {
            super(HasBox);
        };
        process(item: HasBox) {
            this.renderer.add(item.RenderDebugBox);
        };
    };

};

