/// <reference path="../build/base.d.ts" />

interface ElementEntity {
    htmlElement: HTMLElement;
};
let isElementEntity = (item): item is ElementEntity => "htmlElement" in item;

class KeyBgColorSystem extends ECS.System<ElementEntity> {
    private applyColor: string = null;

    public KeyActions = {
        up: {press: () => {this.applyColor = "#f00"}},
        down: {press: () => {this.applyColor = "#0f0"}},
        left: {press: () => {this.applyColor = "#ff0"}},
        right: {press: () => {this.applyColor = "#00f"}}
    };

    constructor() {
        super(isElementEntity);
    };

    process(entity: ElementEntity) {
        entity.htmlElement.style.backgroundColor = this.applyColor;
    };
};

class KeyBgRoom extends ECS.Room {
    public KeyBgSystem = new KeyBgColorSystem();

    runPhysics() {
        this.KeyBgSystem.run(this.Entities);
        this.cleanup();
    };
    runRender() {
    };
};

@Applet.Bind("span")
class SpanTest {

    private keys: Applet.KeyControl;
    private room = new KeyBgRoom(20);
    private loop: ECS.Loop;


    constructor(private element: HTMLSpanElement) {
        this.keys = new Applet.KeyControl(element);
        this.keys.push(this.room.KeyBgSystem.KeyActions);
        this.keys.focus();

        let entity: ECS.Entity & ElementEntity = {
            htmlElement: element
        };

        this.room.Entities.push(entity);

        this.loop = new ECS.Loop(this.room, null);
        this.loop.start();
    };
};

///////////////////////

class DebugRenderSystem extends ECS.System<Render.HasRenderDebugBox> {
    constructor(
        public renderer: Render.RenderList
    ) {
        super(Render.HasRenderDebugBox);
    };
    process(item: Render.HasRenderDebugBox) {
        this.renderer.add(item.RenderDebugBox);
    };
};

class DebugRenderRoom extends ECS.Room {
    private renderer = new Render.RenderList();
    public Layer = new Render.Layer(1);

    private DebugRenderSystem = new DebugRenderSystem(this.renderer);

    runPhysics() {
    };
    runRender(cx: CanvasRenderingContext2D) {
        this.renderer.reset();

        this.DebugRenderSystem.run(this.Entities);

        this.renderer.drawTo(cx);
    };

    addBox(box: Render.Box) {
        let entity: ECS.Entity & Render.HasRenderDebugBox = {
            RenderDebugBox: new Render.RenderDebugBox(this.Layer, box)
        };
        this.add(entity);
    };
};

@Applet.Bind("canvas")
class RenderTest {

    private room = new DebugRenderRoom(20);

    private loop: ECS.Loop;

    constructor(private element: HTMLCanvasElement) {

        let cx = element.getContext("2d");

        this.room.addBox(new Render.Box(0,0, 16,16));
        this.room.addBox(new Render.Box(12,100, 20,20));
        this.room.addBox(new Render.Box(50,70, 25,64));

        this.loop = new ECS.Loop(this.room, cx);
        this.loop.start();
    };

};
