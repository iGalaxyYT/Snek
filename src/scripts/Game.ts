import Snek, { Direction } from "./Snek";
import Vector from "./Vector";
import Food from "./Food";

import { EventEmitter } from "events";

export enum Keys {
    ARROW_LEFT = 37,
    ARROW_UP = 38,
    ARROW_RIGHT = 39,
    ARROW_DOWN = 40
}

export interface GameSettings {
    width?: number;
    height?: number;
    scale?: number;
    speed?: number;
    walls?: boolean;
}

const DefaultSettings: GameSettings = {
    width: 17,
    height: 15,
    scale: 30,
    speed: 75,
    walls: false
}

export default class Game extends EventEmitter {
    private context: CanvasRenderingContext2D;
    private settings: GameSettings;

    private snek: Snek;
    private food: Food;
    private timestamp?: number = 0;

    private nextKey: number | null = null;

    private _score: number = 0;

    constructor(canvas: HTMLCanvasElement, settings: GameSettings = {}) {
        super();

        this.context = canvas.getContext('2d');
        this.settings = { ...DefaultSettings, ...settings };

        this.snek = new Snek(this.settings.scale, new Vector(0, 0));
    }

    start(): void {
        this.canvas.width = this.settings.width * this.settings.scale;
        this.canvas.height = this.settings.height * this.settings.scale;

        this.attachKeyboard();
        this.placeFood();
        this.update();
    }

    private rand(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private placeFood(): void {
        const x = this.rand(0, this.settings.width - 1);
        const y = this.rand(0, this.settings.height - 1);

        this.food = new Food(this.settings.scale, new Vector(x, y));
    }

    private attachKeyboard(): void {
        document.addEventListener("keydown", e => {
            if(this.nextKey == null || this.nextKey != e.keyCode) this.nextKey = e.keyCode;
        });
    }

    update(timestamp?: number): void {
        timestamp = timestamp || 0;

        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.snek.draw(this.context);

        if(timestamp - this.timestamp >= this.settings.speed) {
            this.timestamp = timestamp;
            
            this.checkKey();

            if(this.snek.move(this.settings.width - 1, this.settings.height - 1, this.settings.walls)) {
                this.emit('over', this._score);
                return;
            }

            this.checkFoodCollision();
        }

        this.food.draw(this.context);

        requestAnimationFrame(this.update.bind(this));
    }

    private checkKey(): void {
        if(this.nextKey == null) return;

        switch(this.nextKey) {
            case Keys.ARROW_LEFT:
                if(this.snek.direction != Direction.RIGHT) this.snek.direction = Direction.LEFT;
                break;
            case Keys.ARROW_UP:
                if(this.snek.direction != Direction.DOWN) this.snek.direction = Direction.UP;
                break;
            case Keys.ARROW_RIGHT:
                if(this.snek.direction != Direction.LEFT) this.snek.direction = Direction.RIGHT;
                break;
            case Keys.ARROW_DOWN:
                if(this.snek.direction != Direction.UP) this.snek.direction = Direction.DOWN;
                break;
        }

        this.nextKey = null;
    }

    private checkFoodCollision(): void {
        if(this.snek.position.equals(this.food.position)) {
            this.snek.eat(this.food);
            this.emit('score', ++this._score);
            this.placeFood();
        }
    }

    get canvas(): HTMLCanvasElement {
        return this.context.canvas;
    }
}