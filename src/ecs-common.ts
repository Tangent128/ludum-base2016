/// <reference path="ecs.ts" />

namespace ECS {

    export class Location {
        constructor(
            public X: number,
            public Y: number,
            public Angle = 0
        ) {};
        public VX = 0;
        public VY = 0;
        public VAngle = 0;
    };

    export interface HasLocation {
        Location: Location
    };
    export function HasLocation(item: any): item is HasLocation {
        return item.Location != null;
    };

};
