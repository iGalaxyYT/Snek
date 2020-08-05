import Game from "./scripts/Game";

const canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;

const score: HTMLElement = document.getElementById("score") as HTMLElement;
const startButton: HTMLElement = document.getElementById("startButton") as HTMLElement;

startButton.addEventListener('click', (): void => {
    const game = new Game(canvas);

    startButton.style.display = "none";

    game.on("score", s => score.innerHTML = `Score: ${s}`);
    game.on("over", s => {
        score.innerHTML = `You died!\n Score: ${s}`;
        startButton.innerHTML = "Restart";
        startButton.style.display = "inline-block";
    });

    score.innerHTML = "Score: 0";
    game.start();
});