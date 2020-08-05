import Vector from "./Vector";
import ScalableRect from "./ScalableRect";

export default class Food extends ScalableRect {
    constructor(scale: number, position: Vector) {
        super(scale, position);
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = "#F7630C";
        super.draw(context);
    }
}