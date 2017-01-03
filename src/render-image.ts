/// <reference path="./ecs.ts" />
/// <reference path="./render.ts" />

namespace RenderImage {
    export class RenderImage implements Render.Renderer {
        public Location = new ECS.Location(0, 0);

        constructor(
            public Image: HTMLImageElement,
            public X = 0, public Y = 0,
            public W = 32, public H = 32,
            public XOffset = 0, public YOffset = 0
        ) { };

        render(cx: CanvasRenderingContext2D) {
            this.Location.transformCx(cx);

            cx.drawImage(this.Image,
                this.X,this.Y, this.W,this.H,
                this.XOffset,this.YOffset, this.W,this.H
            );
        };
    };

    export function load(url: string): HTMLImageElement {
        let img = new Image();
        img.src = url;
        return img;
    };
};
