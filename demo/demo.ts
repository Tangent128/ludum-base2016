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

class DebugRenderRoom extends ECS.Room {
    private renderer = new Render.RenderList();

    public Camera = new Render.Camera();

    public FarBgLayer = new Render.Layer(1, 0);
    public BgLayer = new Render.Layer(8, 0.5);
    public MainLayer = new Render.Layer(10, 1);

    private DebugRenderSystem = new RenderDebug.System(this.renderer);

    constructor(fps: number) {
        super(fps);
        this.FarBgLayer.Camera = this.Camera;
        this.BgLayer.Camera = this.Camera;
        this.MainLayer.Camera = this.Camera;
    };

    t = 0;
    dt = 1;

    runPhysics() {
        this.t += this.dt;
        if(this.t > 20) {
            this.dt = -1;
        }
        if(this.t < 0) {
            this.dt = 1;
        }

        this.Camera.x = this.t * 3;
        this.Camera.y = this.t + 5;
        this.Camera.zoom = 1 + this.t/20;
    };
    runRender(cx: CanvasRenderingContext2D) {
        this.renderer.reset();

        this.DebugRenderSystem.run(this.Entities);

        this.renderer.drawTo(cx);
    };

    addBox(
        box: Render.Box,
        layer: Render.Layer,
        color = "#f00",
        location: ECS.Location = null
    ) {
        let entity: ECS.Entity & RenderDebug.HasBox = {
            RenderDebugBox: new RenderDebug.Box(layer, box, color)
        };
        if(location) {
            (entity as {} as ECS.HasLocation).Location = location;
        }
        this.add(entity);
    };
};

@Applet.Bind("canvas")
class RenderTest {

    private room = new DebugRenderRoom(20);

    private loop: ECS.Loop;

    constructor(private element: HTMLCanvasElement) {

        let cx = element.getContext("2d");

        this.room.addBox(new Render.Box(0,0, 300,300), this.room.FarBgLayer, "#08f");
        this.room.addBox(new Render.Box(25,100, 20,20), this.room.BgLayer, "#a00");
        this.room.addBox(new Render.Box(75,100, 20,20), this.room.BgLayer, "#a00");
        this.room.addBox(new Render.Box(125,100, 20,20), this.room.BgLayer, "#a00");
        this.room.addBox(new Render.Box(50,70, 25,64), this.room.MainLayer);
        this.room.addBox(
            new Render.Box(0,0, 25,64),
            this.room.MainLayer,
            "#ff0",
            new ECS.Location(150, 70, 0.5)
        );
        this.room.addBox(new Render.Box(250,70, 25,64), this.room.MainLayer);

        this.loop = new ECS.Loop(this.room, cx);
        this.loop.start();
    };

};
