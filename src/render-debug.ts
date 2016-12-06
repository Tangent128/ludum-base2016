/// <reference path="ecs.ts" />
/// <reference path="render.ts" />
/// <reference path="ecs-common.ts" />

namespace RenderDebug {

    export class Box implements Render.Renderable {

        public Location: ECS.Location = null;

        constructor(
            public Layer: Render.Layer,
            public bounds: Render.Box,
            public color = "#f00"
        ) {};

        public render(cx: CanvasRenderingContext2D) {
            let b = this.bounds;
            cx.fillStyle = this.color;
            if(this.Location) {
                this.Location.transformCx(cx);
            }
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
            item.RenderDebugBox.Location =
                ECS.HasLocation(item) ? item.Location : null;
            this.renderer.add(item.RenderDebugBox);
        };
    };

};

