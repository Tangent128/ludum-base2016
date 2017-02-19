import * as ECS from "./ecs";
import { HasLocation } from "./ecs-common";

export class Box {
    constructor(
        public x: number, public y: number,
        public w: number, public h: number
    ) {};
};

/**
 * A thing that can be drawn.
 */
export interface Renderer {
    render(cx: CanvasRenderingContext2D);
};
export interface HasRenderer {
    RenderAs: Renderer,
    RenderLayer: Layer
};
export function HasRenderer(entity: any): entity is HasRenderer {
    return entity.RenderAs != null && entity.RenderLayer != null;
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
 * Collects items needing to be drawn, sort them,
 * and render them.
 */
export function DrawTo(list: any[], cx: CanvasRenderingContext2D) {

    let renderableList: HasRenderer[] = list.filter(HasRenderer);

    // sort list by layer z index
    // TODO: individual item z-indexes
    renderableList.sort((a, b) => {
        return a.RenderLayer.z - b.RenderLayer.z;
    });

    renderableList.map(entity => {
        entity.RenderLayer.enter(cx);

        if(HasLocation(entity)) {
            entity.Location.transformCx(cx);
        }

        entity.RenderAs.render(cx);

        entity.RenderLayer.exit(cx);
    });

};
