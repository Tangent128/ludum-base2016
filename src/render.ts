namespace Render {

    export class Box {
        constructor(
            public x: number, public y: number,
            public w: number, public h: number
        ) {};
    };

    /**
     * A thing that can be drawn.
     */
    export interface Renderable {
        Layer: Layer;
        render(cx: CanvasRenderingContext2D);
    };

    /**
     * A global transform for many onscreen objects.
     */
    export class Camera {
        public x = 0;
        public y = 0;
        public zoom = 1;
    };

    /**
     * A "group" of Renderables that share a common z-order and
     * "camera" transforms.
     */
    export class Layer {

        public Camera = new Camera();

        constructor(
            public z: number,
            public parallax = 1,
            public scale = 1
        ) {};

        public enter(cx: CanvasRenderingContext2D) {
            let camera = this.Camera;
            let scale = this.scale * camera.zoom;
            let parallax = this.parallax;

            cx.save();

            cx.scale(scale, scale);
            cx.translate(-camera.x * parallax, -camera.y * parallax);
        };
        public exit(cx: CanvasRenderingContext2D) {
            cx.restore();
        };
    };

    /**
     * Buffer that collects items needing to be drawn, sorts them,
     * and renders them.
     */
    export class RenderList {

        private items: Renderable[] = [];

        public reset() {
            this.items.length = 0;
        };

        public add(item: Renderable) {
            this.items.push(item);
        };

        public drawTo(cx: CanvasRenderingContext2D) {

            // sort list by z index
            this.items.sort((a, b) => {
                return a.Layer.z - b.Layer.z;
            });

            // draw everything
            for(let item of this.items) {
                item.Layer.enter(cx);
                item.render(cx);
                item.Layer.exit(cx);
            }

        };
    };

};
