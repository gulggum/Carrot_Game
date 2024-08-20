const body = document.querySelector("body");
const playBtn = document.querySelector(".playBtn");
const timeCounter = document.querySelector(".timeCouter");
const carrotNumber = document.querySelector(".carrotNumber");
const carrots = document.querySelector(".carrots");
const bugs = document.querySelector(".bugs");
const success = document.querySelector(".success");
const fail = document.querySelector(".fail");
const returns = document.querySelector(".returnGame");
const field = document.querySelector(".randomItemsField");
//오디오
const bgMusic = document.querySelector(".bgMusic");
const carrotMusic = document.querySelector(".carrotMusic");
const bugMusic = document.querySelector(".bugMusic");
const loseMusic = document.querySelector(".loseMusic");
const winMusic = document.querySelector(".winMusic");

let timer;
let isRunning = false;
const numberOfImages = 10;
let clickCount = 10;
let savedState = "";

//음악 자동재생

//당근 랜덤배치
const appearCarrots = () => {
  for (let i = 0; i < numberOfImages; i++) {
    const fieldRect = field.getBoundingClientRect();
    const locationX = Math.floor(Math.random() * fieldRect.x * 100);
    const locationY = Math.floor(Math.random() * fieldRect.y);
    const carrot = document.createElement("button");
    carrot.classList.add("carrot");
    carrot.innerHTML = `<img src="img/carrot.png" />`;
    carrot.style.transform = `translate(${locationX}px,${locationY}px)`;
    field.appendChild(carrot);

    const removeCarrot = () => {
      carrotMusic.play();
      field.removeChild(carrot);
      --clickCount;
      carrotNumber.innerText = `${clickCount}`;

      if (clickCount === 0) {
        winMusic.play();
        success.classList.remove("success-hidden");
        returns.classList.remove("return-hidden");
      }
    };
    carrot.addEventListener("click", removeCarrot);
  }
};

//벌레 랜덤배치
const appearBugs = () => {
  for (let i = 0; i <= numberOfImages; i++) {
    const fieldRect = field.getBoundingClientRect();
    const locationX = Math.floor(Math.random() * fieldRect.x * 100);
    const locationY = Math.floor(Math.random() * fieldRect.y);
    const bugs = document.createElement("button");
    bugs.classList.add("bugs");
    bugs.innerHTML = `<img src="img/bug.png" />`;
    bugs.style.transform = `translate(${locationX}px,${locationY}px)`;
    field.appendChild(bugs);
    const removeBug = () => {
      bugMusic.play();
      if (removeBug) {
        loseMusic.play();
        fail.classList.remove("fail-hidden");
        returns.classList.remove("return-hidden");
      }
    };
    bugs.addEventListener("click", removeBug);
  }
};

// 카운트다운
const countDown = () => {
  let startSecond = 10;
  timeCounter.innerText = `${startSecond}`;
  timer = setInterval(function () {
    --startSecond;
    if (startSecond <= -1) {
      loseMusic.play();
      clearInterval(timer);
      fail.classList.remove("fail-hidden");
      returns.classList.remove("return-hidden");
    } else {
      timeCounter.innerText = `${startSecond}`;
    }
  }, 1000);
  const stopTimer = () => {
    clearInterval(timer);
    isRunning = false;
  };
};
//클릭 핸들동작
const handlePlay = () => {
  const pauseBtn =
    (playBtn.innerHTML = `<i class="fa-solid fa-pause fa-2xl"></i>`);
  if (pauseBtn) {
    clearInterval(timer);
  }
  countDown();
  appearCarrots();
  appearBugs();
  bgMusic.play().catch((error) => {
    console.log("음악재생오류");
  });
  playBtn.removeEventListener("click", handlePlay);
};

const returnGames = () => {
  location.reload();
};
playBtn.addEventListener("click", handlePlay);
returns.addEventListener("click", returnGames);
