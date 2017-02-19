export class Location {
    constructor(
        public X: number,
        public Y: number,
        public Angle = 0
    ) {};
    public VX = 0;
    public VY = 0;
    public VAngle = 0;

    transformCx(cx: CanvasRenderingContext2D) {
        cx.translate(this.X, this.Y);
        cx.rotate(this.Angle);
    };
};

export interface HasLocation {
    Location: Location
};
export function HasLocation(item: any): item is HasLocation {
    return item.Location != null;
};
