import Game from "./scripts/Game";

const canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;

const score: HTMLElement = document.getElementById("score") as HTMLElement;
const highScore: HTMLElement = document.getElementById("highScore") as HTMLElement;
const startButton: HTMLElement = document.getElementById("startButton") as HTMLElement;
const wallsCheck: HTMLInputElement = document.getElementById("walls") as HTMLInputElement;

if(!localStorage.getItem("highScore")) localStorage.setItem("highScore", "0");

let highScoreValue: Number = Number(localStorage.getItem("highScore"));
highScore.innerHTML = `Highscore: ${highScoreValue}`;

startButton.addEventListener('click', (): void => {
    const game = new Game(canvas, {walls: wallsCheck.checked});

    startButton.style.display = "none";
    highScore.style.display = "none";
    wallsCheck.style.display = "none";
    document.getElementById("wallsLabel").style.display = "none";

    game.on("score", s => {
        score.innerHTML = `Score: ${s}`;
        if(s > highScoreValue) highScoreValue = s;
        localStorage.setItem("highScore", `${highScoreValue}`);
    });

    game.on("over", s => {
        score.innerHTML = `You died!\n Score: ${s}`;
        startButton.innerHTML = "Restart";
        startButton.style.display = "inline-block";
        highScore.style.display = "inline-block";
        wallsCheck.style.display = "inline-block";
        document.getElementById("wallsLabel").style.display = "inline-block";
        highScore.innerHTML = `Highscore: ${highScoreValue}`;
    });

    score.innerHTML = "Score: 0";
    game.start();
});