import Vector from "./Vector";
import ScalableRect from "./ScalableRect";
import Food from "./Food";

export enum Direction {
    LEFT,
    UP,
    RIGHT,
    DOWN
}

export default class Snek extends ScalableRect {
    direction: Direction = Direction.RIGHT;
    tail: ScalableRect[] = [];
    private snakeColor: string;

    constructor(scale: number, position: Vector, snakeColor: string) {
        super(scale, position);
        this.snakeColor = snakeColor;
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.snakeColor;
        super.draw(context);

        this.tail.forEach(part => part.draw(context));
    }

    move(maxX: number, maxY: number, walls: boolean): boolean {
        let x = this.position.x;
        let y = this.position.y;

        switch(this.direction) {
            case Direction.LEFT:
                this.position.x--;
                break;
            case Direction.UP:
                this.position.y--;
                break;
            case Direction.RIGHT:
                this.position.x++;
                break;
            case Direction.DOWN:
                this.position.y++;
                break;
        }

        if(walls == true){
            if(this.position.x < 0) return true;
            if(this.position.y < 0) return true;
            if(this.position.x > maxX) return true;
            if(this.position.y > maxY) return true;
        } else {
            if(this.position.x < 0) this.position.x = maxX;
            if(this.position.y < 0) this.position.y = maxY;
            if(this.position.x > maxX) this.position.x = 0;
            if(this.position.y > maxY) this.position.y = 0;
        }

        for(let tpart of this.tail) {
            if(this.position.equals(tpart.position)) return true;

            const xtmp = tpart.position.x;
            const ytmp = tpart.position.y;

            tpart.position.set(x, y);

            x = xtmp;
            y = ytmp;
        }

        return false;
    }

    eat(food: Food): void {
        this.tail.push(new ScalableRect(this.scale, food.position));
    }
}