import * as ECS from "./ecs";
import { HasLocation, Location } from "./ecs-common";

/**
 * Utilities for establishing an object's location relative to a parent
 */
export class PinTo {
    constructor(
        public Parent: ECS.Entity & HasLocation,
        public X = 0,
        public Y = 0
    ) {};
};
export interface HasPin extends HasLocation {
    PinTo: PinTo
};
export function HasPin(entity: any): entity is HasPin {
    return (entity.PinTo != null) && HasLocation(entity);
};

/**
 * Updates locations of pinned objects.
 * Make sure this runs after parent locations are set.
 */
export class PinSystem extends ECS.System<HasPin> {

    constructor() {
        super(HasPin);
    };

    process(entity: HasPin) {
        let offset = this.calcOffset(entity);
        entity.Location.X = offset.x;
        entity.Location.Y = offset.y;
    };

    calcOffset(entity: ECS.Entity & HasPin) {
        let pin = entity.PinTo;

        let parent = pin.Parent;
        let x = parent.Location.X;
        let y = parent.Location.Y;

        if(HasPin(parent)) {
            let parentOffset = this.calcOffset(parent);
            x = parentOffset.x;
            y = parentOffset.y;
        }

        x += pin.X;
        y += pin.Y;

        if(parent.deleted) {
            entity.deleted = true;
        }

        return {
            x: x,
            y: y,
            rot: 0
        };
    };

};

export function Attach(parent: HasLocation, child: any, x: number, y: number) {
    child.Location = new Location(0,0);
    child.PinTo = new PinTo(parent, x, y);
};
