const app = document.getElementById("app");

const modePill = document.getElementById("modePill");
const systemText = document.getElementById("systemText");
const coreMode = document.getElementById("coreMode");
const stageValue = document.getElementById("stageValue");

const powerRing = document.getElementById("powerRing");
const boostRing = document.getElementById("boostRing");

const powerValue = document.getElementById("powerValue");
const boostValue = document.getElementById("boostValue");
const surgeValue = document.getElementById("surgeValue");
const thrustValue = document.getElementById("thrustValue");
const heatValue = document.getElementById("heatValue");

const powerCaption = document.getElementById("powerCaption");
const boostCaption = document.getElementById("boostCaption");

const reactorBar = document.getElementById("reactorBar");
const turboBar = document.getElementById("turboBar");
const reactorPct = document.getElementById("reactorPct");
const turboPct = document.getElementById("turboPct");

const shockContainer = document.getElementById("shockContainer");

const startBtn = document.getElementById("startBtn");
const turboBtn = document.getElementById("turboBtn");

const startSound = new Audio("assets/Start engine.mp3");
const turboSound = new Audio("assets/Ferrari acc.mp3");

startSound.preload = "auto";
turboSound.preload = "auto";

let state = "ev";
let animFrame = null;
let turboInterval = null;
let evTicker = 0;

const values = {
  power: 38,
  boost: 12,
  surge: 22,
  thrust: 14,
  heat: 8,
  reactor: 34,
  turbo: 8
};

function clamp(num, min, max){
  return Math.max(min, Math.min(max, num));
}

function setRing(el, pct){
  el.style.setProperty("--pct", clamp(pct, 0, 100));
}

function setBar(el, pct){
  el.style.width = `${clamp(pct, 0, 100)}%`;
}

function pad2(n){
  return String(Math.round(n)).padStart(2, "0");
}

function render(){
  powerValue.textContent = Math.round(values.power);
  boostValue.textContent = Math.round(values.boost);
  surgeValue.textContent = pad2(values.surge);
  thrustValue.textContent = pad2(values.thrust);
  heatValue.textContent = pad2(values.heat);

  reactorPct.textContent = `${Math.round(values.reactor)}%`;
  turboPct.textContent = `${pad2(values.turbo)}%`;

  setRing(powerRing, values.power);
  setRing(boostRing, values.boost);

  setBar(reactorBar, values.reactor);
  setBar(turboBar, values.turbo);
}

function shockwave(count = 1, delay = 0){
  for(let i = 0; i < count; i++){
    setTimeout(() => {
      const wave = document.createElement("div");
      wave.className = "shockWave";
      shockContainer.appendChild(wave);
      setTimeout(() => wave.remove(), 1100);
    }, delay + i * 120);
  }
}

function switchState(next){
  state = next;
  app.classList.remove("ev", "engine", "turbo");
  app.classList.add(next);
}

function setTexts(mode, sys, core, stage, powerCap, boostCap){
  modePill.textContent = mode;
  systemText.textContent = sys;
  coreMode.textContent = core;
  stageValue.textContent = stage;
  powerCaption.textContent = powerCap;
  boostCaption.textContent = boostCap;
}

function stopTurboInterval(){
  if(turboInterval){
    clearInterval(turboInterval);
    turboInterval = null;
  }
}

function startEvAmbient(){
  cancelAnimationFrame(animFrame);

  const loop = () => {
    if(state !== "ev") return;

    evTicker += 0.02;

    values.power = 36 + Math.sin(evTicker) * 7 + Math.sin(evTicker * 0.5) * 2;
    values.boost = 10 + Math.sin(evTicker * 1.5 + 1.1) * 4;
    values.surge = 20 + Math.sin(evTicker * 1.1) * 5;
    values.thrust = 13 + Math.sin(evTicker * 0.8 + 0.5) * 3;
    values.heat = 7 + Math.sin(evTicker * 0.7 + 2) * 2;
    values.reactor = 32 + Math.sin(evTicker * 0.85) * 6;
    values.turbo = 7 + Math.sin(evTicker * 1.7 + 1.3) * 2;

    render();
    animFrame = requestAnimationFrame(loop);
  };

  loop();
}

function engineIgnitionSequence(){
  cancelAnimationFrame(animFrame);
  stopTurboInterval();

  let frame = 0;
  const duration = 210;

  setTexts(
    "IGNITION",
    "ignition sequence",
    "IGN",
    "STAGE I",
    "combustion wakeup",
    "pressure rising"
  );

  shockwave(3, 80);

  const loop = () => {
    frame++;

    const t = frame / duration;

    if(t < 0.23){
      values.power = 38 + t * 260;
      values.boost = 12 + t * 80;
      values.surge = 22 + t * 140;
      values.thrust = 14 + t * 120;
      values.heat = 8 + t * 90;
      values.reactor = 34 + t * 180;
      values.turbo = 8 + t * 40;
    } else if(t < 0.42){
      values.power = 95 - (t - 0.23) * 120;
      values.boost = 30 - (t - 0.23) * 18;
      values.surge = 54 - (t - 0.23) * 12;
      values.thrust = 42 - (t - 0.23) * 10;
      values.heat = 28 + (t - 0.23) * 35;
      values.reactor = 76 - (t - 0.23) * 14;
      values.turbo = 14 + (t - 0.23) * 8;
    } else {
      const settle = (t - 0.42) / 0.58;
      values.power = 72 + Math.sin(settle * 10) * 3;
      values.boost = 24 + Math.sin(settle * 8) * 2;
      values.surge = 46 + Math.sin(settle * 6) * 3;
      values.thrust = 36 + Math.sin(settle * 7) * 2;
      values.heat = 32 + Math.sin(settle * 5) * 2;
      values.reactor = 68 + Math.sin(settle * 6) * 3;
      values.turbo = 18 + Math.sin(settle * 8) * 1.5;
    }

    render();

    if(frame === 36){
      shockwave(2, 0);
    }
    if(frame === 82){
      shockwave(2, 0);
    }

    if(frame < duration){
      animFrame = requestAnimationFrame(loop);
    } else {
      setTexts(
        "ENGINE ONLINE",
        "hybrid beast active",
        "LIVE",
        "STAGE II",
        "reactor awake",
        "boost armed"
      );
      holdEngineAmbient();
    }
  };

  loop();
}

function holdEngineAmbient(){
  let tick = 0;
  cancelAnimationFrame(animFrame);

  const loop = () => {
    if(state !== "engine") return;
    tick += 0.04;

    values.power = 71 + Math.sin(tick * 0.9) * 5;
    values.boost = 23 + Math.sin(tick * 1.5) * 3;
    values.surge = 46 + Math.sin(tick * 1.2) * 4;
    values.thrust = 35 + Math.sin(tick * 1.1 + 0.6) * 3;
    values.heat = 33 + Math.sin(tick * 0.8 + 0.9) * 3;
    values.reactor = 67 + Math.sin(tick * 1.1) * 5;
    values.turbo = 18 + Math.sin(tick * 1.8) * 2;

    render();
    animFrame = requestAnimationFrame(loop);
  };

  loop();
}

function turboSequence(){
  cancelAnimationFrame(animFrame);
  stopTurboInterval();

  setTexts(
    "TURBO BEAST",
    "boost engaged",
    "RAGE",
    "STAGE III",
    "reactor overdrive",
    "pressure unlocked"
  );

  switchState("turbo");
  shockwave(5, 0);
  app.classList.add("turboShake");
  setTimeout(() => app.classList.remove("turboShake"), 1200);

  try{
    turboSound.currentTime = 0;
    turboSound.play();
  }catch(e){}

  const stages = [
    { label: "STAGE III", power: 84, boost: 48, surge: 58, thrust: 46, heat: 38, reactor: 74, turbo: 42 },
    { label: "STAGE IV",  power: 96, boost: 66, surge: 74, thrust: 63, heat: 52, reactor: 82, turbo: 58 },
    { label: "STAGE V",   power: 100, boost: 82, surge: 89, thrust: 80, heat: 68, reactor: 92, turbo: 74 },
    { label: "BEAST MAX", power: 100, boost: 100, surge: 100, thrust: 100, heat: 86, reactor: 100, turbo: 100 }
  ];

  let idx = 0;

  function animateTo(target, duration = 420, callback){
    const start = {
      power: values.power,
      boost: values.boost,
      surge: values.surge,
      thrust: values.thrust,
      heat: values.heat,
      reactor: values.reactor,
      turbo: values.turbo
    };

    const startTime = performance.now();

    function frame(now){
      const p = clamp((now - startTime) / duration, 0, 1);
      const e = 1 - Math.pow(1 - p, 3);

      values.power = start.power + (target.power - start.power) * e;
      values.boost = start.boost + (target.boost - start.boost) * e;
      values.surge = start.surge + (target.surge - start.surge) * e;
      values.thrust = start.thrust + (target.thrust - start.thrust) * e;
      values.heat = start.heat + (target.heat - start.heat) * e;
      values.reactor = start.reactor + (target.reactor - start.reactor) * e;
      values.turbo = start.turbo + (target.turbo - start.turbo) * e;

      render();

      if(p < 1){
        requestAnimationFrame(frame);
      } else {
        callback?.();
      }
    }

    requestAnimationFrame(frame);
  }

  function nextStage(){
    if(idx >= stages.length){
      setTexts(
        "TURBO MAX",
        "monster output stable",
        "MAX",
        "BEAST MAX",
        "full reactor force",
        "all pressure released"
      );
      holdTurboAmbient();
      return;
    }

    const target = stages[idx];
    stageValue.textContent = target.label;
    shockwave(2, 0);

    animateTo(target, 460, () => {
      if(idx < stages.length - 1){
        // fake gear dip / stage kick
        const dip = {
          power: target.power - 10,
          boost: target.boost - 7,
          surge: target.surge - 9,
          thrust: target.thrust - 8,
          heat: target.heat + 3,
          reactor: target.reactor - 6,
          turbo: target.turbo - 5
        };

        animateTo(dip, 150, () => {
          idx++;
          setTimeout(nextStage, 100);
        });
      } else {
        idx++;
        setTimeout(nextStage, 120);
      }
    });
  }

  nextStage();
}

function holdTurboAmbient(){
  let tick = 0;
  cancelAnimationFrame(animFrame);

  const loop = () => {
    if(state !== "turbo") return;
    tick += 0.08;

    values.power = 96 + Math.sin(tick * 1.9) * 4;
    values.boost = 92 + Math.sin(tick * 2.2 + 0.4) * 7;
    values.surge = 95 + Math.sin(tick * 2.3 + 1) * 5;
    values.thrust = 91 + Math.sin(tick * 1.8 + 2) * 7;
    values.heat = 84 + Math.sin(tick * 1.5 + 0.8) * 5;
    values.reactor = 98 + Math.sin(tick * 2.1) * 2;
    values.turbo = 97 + Math.sin(tick * 2.8 + 0.2) * 3;

    render();
    animFrame = requestAnimationFrame(loop);
  };

  loop();
}

startBtn.addEventListener("click", () => {
  if(state !== "ev") return;

  try{
    startSound.currentTime = 0;
    startSound.play();
  }catch(e){}

  switchState("engine");
  engineIgnitionSequence();
});

turboBtn.addEventListener("click", () => {
  if(state === "ev"){
    // Gör inget om man inte startat ännu
    return;
  }
  turboSequence();
});

// initial state
setTexts(
  "EV BEAST",
  "core online",
  "EV",
  "E-DRIVE",
  "electric pulse stable",
  "standby pressure"
);

render();
startEvAmbient();