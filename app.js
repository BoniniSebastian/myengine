const app = document.getElementById("app");

const modePill = document.getElementById("modePill");
const systemText = document.getElementById("systemText");
const coreMode = document.getElementById("coreMode");
const heroMode = document.getElementById("heroMode");
const stageValue = document.getElementById("stageValue");
const peakValue = document.getElementById("peakValue");

const powerRing = document.getElementById("powerRing");
const boostRing = document.getElementById("boostRing");

const powerValue = document.getElementById("powerValue");
const boostValue = document.getElementById("boostValue");

const surgeDial = document.getElementById("surgeDial");
const thrustDial = document.getElementById("thrustDial");
const heatDial = document.getElementById("heatDial");

const surgeValue = document.getElementById("surgeValue");
const thrustValue = document.getElementById("thrustValue");
const heatValue = document.getElementById("heatValue");

const powerCaption = document.getElementById("powerCaption");
const boostCaption = document.getElementById("boostCaption");

const reactorBar = document.getElementById("reactorBar");
const turboBar = document.getElementById("turboBar");
const syncBar = document.getElementById("syncBar");

const reactorPct = document.getElementById("reactorPct");
const turboPct = document.getElementById("turboPct");
const syncPct = document.getElementById("syncPct");

const shockContainer = document.getElementById("shockContainer");

const evBtn = document.getElementById("evBtn");
const startBtn = document.getElementById("startBtn");
const turboBtn = document.getElementById("turboBtn");

const startSound = new Audio("assets/Start engine.mp3");
const turboSound = new Audio("assets/Ferrari acc.mp3");
startSound.preload = "auto";
turboSound.preload = "auto";

let state = "ev";
let animFrame = null;
let ticker = 0;

const values = {
  power: 38,
  boost: 12,
  surge: 22,
  thrust: 14,
  heat: 8,
  reactor: 34,
  turbo: 8,
  sync: 19
};

function clamp(num, min, max){
  return Math.max(min, Math.min(max, num));
}

function setRing(el, pct){
  el.style.setProperty("--pct", clamp(pct, 0, 100));
}

function setMiniDial(el, pct){
  const ring = el.querySelector(".miniDialRing");
  ring.style.setProperty("--pct", clamp(pct, 0, 100));
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
  syncPct.textContent = `${pad2(values.sync)}%`;

  setRing(powerRing, values.power);
  setRing(boostRing, values.boost);

  setMiniDial(surgeDial, values.surge);
  setMiniDial(thrustDial, values.thrust);
  setMiniDial(heatDial, values.heat);

  setBar(reactorBar, values.reactor);
  setBar(turboBar, values.turbo);
  setBar(syncBar, values.sync);
}

function stopLoops(){
  cancelAnimationFrame(animFrame);
}

function switchState(next){
  state = next;
  app.classList.remove("ev", "engine", "turbo");
  app.classList.add(next);
}

function setTexts(mode, sys, core, stage, peak, powerCap, boostCap){
  modePill.textContent = mode;
  systemText.textContent = sys;
  coreMode.textContent = core;
  heroMode.textContent = core;
  stageValue.textContent = stage;
  peakValue.textContent = peak;
  powerCaption.textContent = powerCap;
  boostCaption.textContent = boostCap;
}

function safePlay(audio){
  try{
    audio.currentTime = 0;
    audio.play();
  }catch(e){}
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

function animateTo(target, duration = 420, callback){
  const start = { ...values };
  const startTime = performance.now();

  function frame(now){
    const p = clamp((now - startTime) / duration, 0, 1);
    const e = 1 - Math.pow(1 - p, 3);

    Object.keys(target).forEach(key => {
      values[key] = start[key] + (target[key] - start[key]) * e;
    });

    render();

    if(p < 1){
      requestAnimationFrame(frame);
    } else {
      callback?.();
    }
  }

  requestAnimationFrame(frame);
}

function startEvAmbient(){
  stopLoops();

  setTexts(
    "EV BEAST",
    "core online",
    "EV",
    "E-DRIVE",
    "CALM",
    "electric pulse stable",
    "standby pressure"
  );

  const loop = () => {
    if(state !== "ev") return;

    ticker += 0.02;

    values.power = 36 + Math.sin(ticker) * 7 + Math.sin(ticker * 0.5) * 2;
    values.boost = 10 + Math.sin(ticker * 1.5 + 1.1) * 4;
    values.surge = 20 + Math.sin(ticker * 1.1) * 5;
    values.thrust = 13 + Math.sin(ticker * 0.8 + 0.5) * 3;
    values.heat = 7 + Math.sin(ticker * 0.7 + 2) * 2;
    values.reactor = 32 + Math.sin(ticker * 0.85) * 6;
    values.turbo = 7 + Math.sin(ticker * 1.7 + 1.3) * 2;
    values.sync = 18 + Math.sin(ticker * 0.6 + 0.8) * 4;

    render();
    animFrame = requestAnimationFrame(loop);
  };

  loop();
}

function holdEngineAmbient(){
  stopLoops();

  const loop = () => {
    if(state !== "engine") return;

    ticker += 0.045;

    values.power = 71 + Math.sin(ticker * 0.9) * 5;
    values.boost = 23 + Math.sin(ticker * 1.5) * 3;
    values.surge = 46 + Math.sin(ticker * 1.2) * 4;
    values.thrust = 35 + Math.sin(ticker * 1.1 + 0.6) * 3;
    values.heat = 33 + Math.sin(ticker * 0.8 + 0.9) * 3;
    values.reactor = 67 + Math.sin(ticker * 1.1) * 5;
    values.turbo = 18 + Math.sin(ticker * 1.8) * 2;
    values.sync = 62 + Math.sin(ticker * 1.2 + 0.3) * 6;

    render();
    animFrame = requestAnimationFrame(loop);
  };

  loop();
}

function holdTurboAmbient(){
  stopLoops();

  const loop = () => {
    if(state !== "turbo") return;

    ticker += 0.085;

    values.power = 96 + Math.sin(ticker * 1.9) * 4;
    values.boost = 92 + Math.sin(ticker * 2.2 + 0.4) * 7;
    values.surge = 95 + Math.sin(ticker * 2.3 + 1) * 5;
    values.thrust = 91 + Math.sin(ticker * 1.8 + 2) * 7;
    values.heat = 84 + Math.sin(ticker * 1.5 + 0.8) * 5;
    values.reactor = 98 + Math.sin(ticker * 2.1) * 2;
    values.turbo = 97 + Math.sin(ticker * 2.8 + 0.2) * 3;
    values.sync = 94 + Math.sin(ticker * 2 + 0.2) * 4;

    render();
    animFrame = requestAnimationFrame(loop);
  };

  loop();
}

function engineIgnitionSequence(){
  stopLoops();
  switchState("engine");

  setTexts(
    "IGNITION",
    "ignition sequence",
    "IGN",
    "STAGE I",
    "WAKE",
    "combustion wakeup",
    "pressure rising"
  );

  shockwave(3, 80);

  let frame = 0;
  const duration = 210;

  function loop(){
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
      values.sync = 19 + t * 110;
    } else if(t < 0.42){
      values.power = 95 - (t - 0.23) * 120;
      values.boost = 30 - (t - 0.23) * 18;
      values.surge = 54 - (t - 0.23) * 12;
      values.thrust = 42 - (t - 0.23) * 10;
      values.heat = 28 + (t - 0.23) * 35;
      values.reactor = 76 - (t - 0.23) * 14;
      values.turbo = 14 + (t - 0.23) * 8;
      values.sync = 56 + (t - 0.23) * 26;
    } else {
      const settle = (t - 0.42) / 0.58;
      values.power = 72 + Math.sin(settle * 10) * 3;
      values.boost = 24 + Math.sin(settle * 8) * 2;
      values.surge = 46 + Math.sin(settle * 6) * 3;
      values.thrust = 36 + Math.sin(settle * 7) * 2;
      values.heat = 32 + Math.sin(settle * 5) * 2;
      values.reactor = 68 + Math.sin(settle * 6) * 3;
      values.turbo = 18 + Math.sin(settle * 8) * 1.5;
      values.sync = 63 + Math.sin(settle * 5) * 4;
    }

    render();

    if(frame === 36) shockwave(2, 0);
    if(frame === 82) shockwave(2, 0);

    if(frame < duration){
      animFrame = requestAnimationFrame(loop);
    } else {
      setTexts(
        "ENGINE ONLINE",
        "hybrid beast active",
        "LIVE",
        "STAGE II",
        "ARMED",
        "reactor awake",
        "boost armed"
      );
      holdEngineAmbient();
    }
  }

  loop();
}

function turboSequence(){
  stopLoops();
  switchState("turbo");

  setTexts(
    "TURBO BEAST",
    "boost engaged",
    "RAGE",
    "STAGE III",
    "ATTACK",
    "reactor overdrive",
    "pressure unlocked"
  );

  shockwave(5, 0);
  app.classList.add("turboShake");
  setTimeout(() => app.classList.remove("turboShake"), 1200);

  safePlay(turboSound);

  const stages = [
    { label: "STAGE III", peak: "RISE",  power: 84, boost: 48, surge: 58, thrust: 46, heat: 38, reactor: 74, turbo: 42, sync: 73 },
    { label: "STAGE IV",  peak: "CLAW",  power: 96, boost: 66, surge: 74, thrust: 63, heat: 52, reactor: 82, turbo: 58, sync: 84 },
    { label: "STAGE V",   peak: "RUSH",  power: 100, boost: 82, surge: 89, thrust: 80, heat: 68, reactor: 92, turbo: 74, sync: 92 },
    { label: "BEAST MAX", peak: "MAX",   power: 100, boost: 100, surge: 100, thrust: 100, heat: 86, reactor: 100, turbo: 100, sync: 100 }
  ];

  let idx = 0;

  function nextStage(){
    if(idx >= stages.length){
      setTexts(
        "TURBO MAX",
        "monster output stable",
        "MAX",
        "BEAST MAX",
        "MAX",
        "full reactor force",
        "all pressure released"
      );
      holdTurboAmbient();
      return;
    }

    const target = stages[idx];
    stageValue.textContent = target.label;
    peakValue.textContent = target.peak;
    shockwave(2, 0);

    animateTo(target, 460, () => {
      if(idx < stages.length - 1){
        const dip = {
          power: target.power - 10,
          boost: target.boost - 7,
          surge: target.surge - 9,
          thrust: target.thrust - 8,
          heat: target.heat + 3,
          reactor: target.reactor - 6,
          turbo: target.turbo - 5,
          sync: target.sync - 6
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

function resetToEv(){
  stopLoops();
  switchState("ev");

  setTexts(
    "EV BEAST",
    "returning to electric core",
    "EV",
    "E-DRIVE",
    "CALM",
    "electric pulse stable",
    "standby pressure"
  );

  shockwave(2, 0);

  animateTo(
    {
      power: 38,
      boost: 12,
      surge: 22,
      thrust: 14,
      heat: 8,
      reactor: 34,
      turbo: 8,
      sync: 19
    },
    700,
    () => startEvAmbient()
  );
}

evBtn.addEventListener("click", resetToEv);

startBtn.addEventListener("click", () => {
  if(state !== "ev") return;
  safePlay(startSound);
  engineIgnitionSequence();
});

turboBtn.addEventListener("click", () => {
  if(state === "ev") return;
  turboSequence();
});

render();
startEvAmbient();