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

        this.loop = new ECS.Loop(this.room);
        this.loop.start();
    };
};
