import Game from "./scripts/Game";

const canvas: HTMLCanvasElement = document.getElementById("game") as HTMLCanvasElement;

const score: HTMLElement = document.getElementById("score") as HTMLElement;
const highScore: HTMLElement = document.getElementById("highScore") as HTMLElement;
const startButton: HTMLButtonElement = document.getElementById("startButton") as HTMLButtonElement;
const wallsCheck: HTMLInputElement = document.getElementById("walls") as HTMLInputElement;
const snakeColorInput: HTMLInputElement = document.getElementById("snakeColor") as HTMLInputElement;

if(!localStorage.getItem("highScore")) localStorage.setItem("highScore", "0");
if(!localStorage.getItem("wallsCheck")) localStorage.setItem("wallsCheck", "true");

switch(localStorage.getItem("wallsCheck")){
    case "true":
        wallsCheck.checked = true;
        break;
    case "false":
        wallsCheck.checked = false;
        break;
}

wallsCheck.addEventListener("change", (event): void => {
    localStorage.setItem("wallsCheck", `${(event.target as HTMLInputElement).checked}`);
});

let highScoreValue: Number = Number(localStorage.getItem("highScore"));
highScore.innerHTML = `Highscore: ${highScoreValue}`;

if(highScoreValue >= 100) {
    snakeColorInput.disabled = false;
    snakeColorInput.placeholder = "#BAD80A";
}
snakeColorInput.value = "#BAD80A";

snakeColorInput.addEventListener("change", (event): void => {
    if(highScoreValue < 100) {
        snakeColorInput.value = "#BAD80A";
        alert("🐍 Nice try, bud.");
        return;
    }
    let s = new Option().style;
    s.color = (event.target as HTMLInputElement).value;
    if(s.color.length > 0){
        startButton.disabled = false;
    } else {
        startButton.disabled = true;
    }
});

startButton.addEventListener('click', (): void => {
    const game = new Game(canvas, {walls: wallsCheck.checked, snakeColor: snakeColorInput.value});

    [...document.getElementsByClassName("hideDuringGame")].forEach((element: HTMLElement) => {
        element.style.display = "none";
    });
    [...document.getElementsByClassName("hideDuringGameButton")].forEach((element: HTMLElement) => {
        element.style.display = "none";
    });

    game.on("score", s => {
        score.innerHTML = `Score: ${s}`;
        if((s > highScoreValue) && wallsCheck.checked == true) highScoreValue = s;
        localStorage.setItem("highScore", `${highScoreValue}`);
    });

    game.on("over", s => {
        score.innerHTML = `You died!\n Score: ${s}`;
        startButton.innerHTML = "Restart";
        [...document.getElementsByClassName("hideDuringGame")].forEach((element: HTMLElement) => {
            element.style.display = "block";
        });
        [...document.getElementsByClassName("hideDuringGameButton")].forEach((element: HTMLElement) => {
            element.style.display = "inline-block";
        });
        highScore.innerHTML = `Highscore: ${highScoreValue}`;
    });

    score.innerHTML = "Score: 0";
    game.start();
});