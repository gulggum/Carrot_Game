const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 5;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect(); //field의 좌표,너비등정보
const playBtn = document.querySelector(".playBtn");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");
const pop__Up = document.querySelector(".pop-up");
const replayBtn = document.querySelector(".pop-up__replay__Btn");
const popUpMessage = document.querySelector(".pop-up__message");

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const alertSound = new Audio("./sound/alert.wav");
const bgSound = new Audio("./sound/bg.mp3");
const winSound = new Audio("./sound/game_win.mp3");

let started = false; //게임 시작할떈 true라는걸로 지정해줌
let score = 0;
let timer = undefined; // 위 false로 게임이 멈춰있다가(undefined)시작되면 타이머작동하도록
let intervalId;
let intervalActive = false;

// 게임시작 이벤트
const handlePlay = () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
};

function returnPlayClick() {
  location.reload();
  hidePopUp();
}

//게임 시작
function startGame() {
  started = true;
  initGame();
  pauseBtn();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

//게임 멈춤
function stopGame() {
  started = false;
  stopGameTimer();
  pauseBtnHide();
  showPopUp();
  playSound(alertSound);
  stopSound(bgSound);
  returnPlayClick();
}

function finishGame(win) {
  started = false;
  // pauseBtnHide();
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopSound(bgSound);
  stopGameTimer();
  showPopUp();
  showPopUpMessage(
    win
      ? (popUpMessage.innerText = "You Won 🎉")
      : (popUpMessage.innerText = "You Lost 🤷‍♂️")
  );
}

function pauseBtnHide() {
  playBtn.style.visibility = "hidden";
}

function pauseBtn() {
  const paused = document.querySelector(".fas");
  paused.classList.add("fa-stop");
  paused.classList.remove("fa-play");
  playBtn.style.visibility = "visible";
}

function showTimerAndScore() {
  gameTimer.style.visibility = "visible";
  gameScore.style.visibility = "visible";
  //visibility로 css에 hidden을 설정해줄수있다
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    updateTimerText(--remainingTimeSec);
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(); //타이머가 종료되면 게임을 끝내준다
      return;
    }
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}

function showPopUp() {
  pop__Up.style.visibility = "visible";
  popUpMessage.innerText = "Replay?";
  showPopUpMessage();
}

function hidePopUp() {
  pop__Up.style.visibility = "hidden";
  popUpMessage.style.visibility = "hidden";
}

// 게임 아이템 배치
function initGame() {
  field.innerHTML = ""; // 필드의 값을 초기화(계속 추가되는걸 방지)
  score = 0;
  gameScore.innerText = CARROT_COUNT;

  addItem("carrot", CARROT_COUNT, "img/carrot.png");
  addItem("bug", BUG_COUNT, "img/bug.png");
}

//필드내 이벤트들
const fieldClick = (event) => {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches(".carrot")) {
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true); //이겼으니 true!
    }
  } else if (target.matches(".bug")) {
    finishGame(false); //졌으니 false 게임을 끝내다
  }
};

function playSound(sound) {
  sound.currentTime = 0; //다시 시작하게되면 처음부터 재생이되도록 0 설정
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function updateScoreBoard() {
  gameScore.innerText = CARROT_COUNT - score;
  console.log(`🥕${CARROT_COUNT} -${score}`);
}

function showPopUpMessage() {
  popUpMessage.style.visibility = "visible";
}

// 아이템(carrot,bug) 랜덤 배치하기
function addItem(className, count, imgPath) {
  //field의 x,y의 전체 좌표범위
  x1 = 0;
  y1 = 0;
  x2 = fieldRect.width - CARROT_SIZE;
  y2 = fieldRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    item.style.position = "absolute";
    item.style.cursor = "pointer";

    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

playBtn.addEventListener("click", handlePlay);
field.addEventListener("click", fieldClick);
replayBtn.addEventListener("click", returnPlayClick);
