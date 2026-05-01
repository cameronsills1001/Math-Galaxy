// change padding by tens place per length of top or botton number
// in ghost_input

//variables


const gameState = {
    top: 0,
    bottom: 0,
    op: "+",
    spec: "any",
    max: 10,
    score: 0
}

const highScores = {
    add: 0,
    sub: 0,
    mul: 0
}

// load high score if saved
Object.assign(highScores, JSON.parse(localStorage.getItem("highScores")));

// get elements
let menu = document.getElementById("menu");
let playArea = document.getElementById("play_area");
let select = document.getElementById("spec_num");
let menuLink = document.getElementById("menu_link");
let operator = document.getElementById("operator");
let topNum = document.getElementById("top");
let bottomNum = document.getElementById("bottom");
let userInput = document.getElementById("user_input");
let scoreDisplay = document.getElementById("score");
let levelSelect = document.getElementById("level");
let buttons = document.getElementsByClassName("menu_button");
let highScore = document.getElementById("high_score");
let settings = document.getElementById("settings");
let settingsButton = document.getElementById("settings_button");
let backButton = document.getElementById("back_button");
let gameTitle = document.getElementById("game_title");
let scoreReset = document.getElementById("reset");

// assign event listeners

Array.from(buttons).forEach(btn => {
    if(btn.classList.contains("mode")) {
        btn.addEventListener("click", launchOp);
    }   
});

menuLink.addEventListener("click", returnToMenu);

userInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
        processAnswer();
    }
});

settingsButton.addEventListener("click", openSettings);

levelSelect.addEventListener("change", setLevel);
backButton.addEventListener("click", saveSettings);
scoreReset.addEventListener("click", resetHighScore);

//functions
function resetHighScore(){
    let result = confirm("Are you sure you want to reset high scores?")
    if(result){
        highScores.add = 0;
        highScores.sub = 0;
        highScores.mul = 0;
        localStorage.removeItem("highScores");
    }
    
}

function saveSettings() {
    settings.classList.add("hide");
    menu.classList.remove("hide");
}

function openSettings(){
    menu.classList.add("hide");
    settings.classList.remove("hide");
}


function setLevel(){
    console.log(levelSelect.value);
    gameState.max = levelSelect.value;
    select.innerHTML = "";
    const anyOption = new Option("any", "any");
    select.add(anyOption);
    for(i=0; i<gameState.max; i++){
        const option = new Option(i, i);
        select.add(option);
    }
    
}

function processAnswer() {
    let userNum = Number(userInput.value);
    let correctAnswer;

    if(gameState.op === "+"){
        correctAnswer = gameState.top + gameState.bottom;
    }
    else if(gameState.op === "-"){
        correctAnswer = gameState.top - gameState.bottom;
    }
    else{
        correctAnswer = gameState.top * gameState.bottom;
    }
    
    if(userNum === correctAnswer){
        markCorrect();
    } else{
        markIncorrect();
    }
}

function addToScore(){
    gameState.score++;
    scoreDisplay.textContent = `Score: ${gameState.score}`;
    processHighScore();
}

function processHighScore() {
    
    if(gameState.op === "+"  && gameState.score > highScores.add){
        highScores.add = gameState.score;     
    } 
    else if (gameState.op === "-" && gameState.score > highScores.sub){
        highScores.sub = gameState.score;
    } 
    else if (gameState.op === "x" && gameState.score > highScores.mul){
        highScores.mul = gameState.score;
    }
    localStorage.setItem("highScores", JSON.stringify(highScores));
}

function markCorrect(){
    playArea.classList.add("correct");
    setTimeout(() => {
        playArea.classList.remove("correct");
    }, 500);
    addToScore();
    userInput.value = "";
    selectGame(gameState.op);
}

function markIncorrect(){
     playArea.classList.add("incorrect");
    setTimeout(() => {
        playArea.classList.remove("incorrect");
    }, 500);
    userInput.value = "";
    selectGame(gameState.op);
}

function launchOp(e){
    gameState.op = e.target.value;
    operator.textContent = gameState.op;
    menu.classList.add("hide");
    playArea.classList.remove("hide");
    gameState.spec = select.value;
    gameTitle.classList.add("invisible");
    selectGame();
    
}

function selectGame(){
    if(gameState.op === "+"){
        addition(); 
    }
    else if(gameState.op === "-"){
        subtraction();
    }
    else {
        multiplication();
    }
    
}

function prepareProblem(){
    topNum.textContent = gameState.top;
    bottomNum.textContent = gameState.bottom;
    userInput.focus();
}
function setProblemNumbers(){
    gameState.top = gameState.spec === "any" ? randomNum(gameState.max) : gameState.spec;
    gameState.bottom = randomNum(gameState.max);
}

function generalSetup(){
     setProblemNumbers(); 
    if(gameState.spec != "any"){
        randomSwap();
    }
    prepareProblem();
}

function randomSwap(){
    let swap = randomNum(10) <= 3;
    if(swap){
        let buffer = gameState.top;
        gameState.top = gameState.bottom;
        gameState.bottom = buffer;
    }
}

function addition(){
    highScore.textContent = `Top: ${highScores.add}`;
    highScore.classList.remove("hide");
    generalSetup();
}


function subtraction(){
    highScore.textContent = `Top: ${highScores.sub}`;
    highScore.classList.remove("hide");
    setProblemNumbers();
    if(gameState.bottom > gameState.top){
        let buffer = gameState.top;
        gameState.top = gameState.bottom;
        gameState.bottom = buffer;
    }
    prepareProblem();

}

function multiplication(){
    highScore.textContent = `Top: ${highScores.mul}`;
    highScore.classList.remove("hide");
    generalSetup();
}

function returnToMenu(){
    highScore.classList.add("hide")
    userInput.value = "";
    gameState.score = 0;
    scoreDisplay.textContent = `Score: ${gameState.score}`;
    playArea.classList.add("hide");
    menu.classList.remove("hide");
    settings.classList.add("hide");
    gameTitle.classList.remove("invisible");

}


function randomNum(max){
    return Math.floor(Math.random() * (max))
}




