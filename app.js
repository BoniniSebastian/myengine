const app = document.querySelector('.app');
const startBtn = document.getElementById('startBtn');
const turboBtn = document.getElementById('turboBtn');
const statusText = document.getElementById('statusText');

const powerArc = document.getElementById('powerArc');
const boostArc = document.getElementById('boostArc');

const startSound = new Audio('assets/Start engine.mp3');
const turboSound = new Audio('assets/Ferrari acc.mp3');

let state = "EV";

/* START ENGINE */
startBtn.onclick = () => {
  if(state !== "EV") return;

  state = "ENGINE";
  app.className = "app engine";

  statusText.innerText = "IGNITION";

  startSound.currentTime = 0;
  startSound.play();

  animateIgnition();
};

/* TURBO */
turboBtn.onclick = () => {
  if(state !== "ENGINE") return;

  state = "TURBO";
  app.className = "app turbo";

  statusText.innerText = "BOOST";

  turboSound.currentTime = 0;
  turboSound.play();

  animateTurbo();
};

/* IGNITION ANIMATION */
function animateIgnition(){
  let power = 0;

  let interval = setInterval(() => {
    power += 5;

    powerArc.style.transform = `scale(${0.6 + power/200})`;

    if(power >= 100){
      clearInterval(interval);
      statusText.innerText = "ENGINE READY";
    }
  }, 40);
}

/* TURBO ANIMATION */
function animateTurbo(){
  let boost = 0;

  let interval = setInterval(() => {
    boost += 4;

    boostArc.style.transform = `scale(${0.6 + boost/150})`;

    powerArc.style.transform = `scale(${0.8 + boost/200})`;

    if(boost >= 100){
      clearInterval(interval);
      statusText.innerText = "MAX POWER";
    }
  }, 30);
}