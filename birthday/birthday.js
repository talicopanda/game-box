import { questions, nextQuestionIndex } from "./story.js";

const app = document.querySelector("#delivery");
const state = { screen: "start", question: 0, sensor: false, charge: 0, termsOpen: false, localizationStep: 0, noAttempts: 0, droneTriggered: false, questionsStarted: false };

const copy = {
  eyebrow: "BIRTHDAY LOGISTICS · PRIORITY 01",
  startTitle: "A very important delivery.",
  startText: "One birthday gift. Unusual dimensions. Sender currently unaccounted for.",
  startButton: "Track the package",
  locationTitle: "Localizing recipient",
  locationLabel: "RECIPIENT LOCATION",
  location: "Vancouver, BC",
  giftLabel: "TRACKED GIFT",
  giftLocation: "Currently in Seattle, WA",
  locationNote: "Birthday courier theatrics. No device location was accessed.",
  locatingSteps: ["Opening the birthday courier map…", "Scanning for birthday activity…", "Signal acquired. Recipient localized: Vancouver, BC."],
  senderLabel: "GIFT-GIVER STATUS",
  senderStatus: "Not at destination",
  etaLabel: "ESTIMATED ARRIVAL",
  eta: "In 3 months",
  locationButton: "Initiate remote delivery",
  signalTitle: "Establishing a secure birthday connection",
  signalText: "Tilt to tune the signal, or use the manual controls. The equipment is extremely old.",
  connectionLoadingTitle: "Trying to recover the birthday signal…",
  connectionLoadingText: "Recalculating the route from Seattle. Please remain dramatically patient.",
  connectionLostTitle: "Connection lost.",
  connectionLostText: "The signal vanished somewhere between Seattle and Vancouver. Answer an extremely important, legally binding question to help the courier find it.",
  connectionLostButton: "Retrieve the signal",
  enableTilt: "Try motion sensor",
  tiltOn: "Motion sensor connected",
  tapTune: "Tap to tune",
  signalLabel: "SIGNAL STRENGTH",
  signalHint: "Find the signal sweet spot",
  legalLabel: "URGENT LEGAL REVIEW",
  yes: "Yes",
  no: "No",
  continue: "Reconnect",
  termsTitle: "TERMS, CONDITIONS & OTHER TERMS",
  termsBody: "These terms govern the handling of birthday parcels, household privileges, snack jurisdiction, television rights, sweaters, and all associated matters.",
  termsButton: "Accept terms and continue",
  revealEyebrow: "DELIVERY COMPLETE · MOSTLY",
  revealTitle: "The real gift is on its way.",
  revealText: "Tales is on his way in three months. For now, here’s something for when you are together.",
  openGift: "Open your gift",
  reducedHint: "No motion sensor? Tap the dial to tune instead.",
  noElephant: "Sorry, there's an elephant covering the button.",
  noTerms: "Terms opened. The answer is in there somewhere.",
  noDrone: "Your response is being delivered elsewhere.",
  elephantMessage: "Sorry, there's an elephant covering the button.",
  termsInstruction: "To decline this offer, answer the question: what color are the courier’s emergency socks? The answer is in the terms and conditions below. Otherwise, scroll to the end and accept the terms and conditions.",
  reconnectTitle: "Trying to recover the birthday signal…",
  reconnectSteps: ["Reacquiring birthday signal…", "Recalculating the route from Seattle…", "Connection unstable. Naturally."],
  reconnectDone: "Connection failed successfully.",
  termsWrong: "Incorrect. The legal department is impressed you got this far.",
  termsRight: "Correct. You have earned the right to decline. The courier declines to honor it.",
};

function render() {
  document.title = "Priority Birthday Delivery";
  app.innerHTML = screens[state.screen]();
  app.dataset.screen = state.screen;
  if (state.screen === "signal" && state.sensor) startMotion();
  if (state.screen === "question" && questions[state.question].gag === "drone" && !state.droneTriggered) {
    state.droneTriggered = true;
    const questionIndex = state.question;
    window.setTimeout(() => {
      if (state.screen !== "question" || state.question !== questionIndex) return;
      const noButton = app.querySelector('.gag-drone [data-action="no"]');
      if (noButton) attemptNo(noButton, "drone");
    }, 1000);
  }
}

function backButton() {
  return state.screen === "start"
    ? ""
    : `<button class="back-button" data-action="back" aria-label="Back">←</button>`;
}

const screens = {
  start: () => `
    <header class="masthead"><span class="stamp">${copy.eyebrow}</span><span class="tracking">GB · 0001</span></header>
    <section class="panel start-panel">
      <div class="package-mark" aria-hidden="true"><span>FRAGILE<br>EMOTIONS</span><i>✳</i></div>
      <p class="overline">TO: KRIS &nbsp; / &nbsp; FROM: TALES</p>
      <h1>${copy.startTitle}</h1>
      <p class="body-copy">${copy.startText}</p>
      <button class="action" data-action="locate">${copy.startButton}<span aria-hidden="true">↗</span></button>
    </section>
    <footer><span>INTERNATIONAL BIRTHDAY COURIER</span><span>HANDLE WITH DRAMA</span></footer>`,

  location: () => `
    <header class="masthead">${backButton()}<span class="stamp">${copy.eyebrow}</span><span class="tracking">RECIPIENT LOCALIZED</span></header>
    <section class="panel location-panel">
      <p class="overline">${copy.locatingSteps.at(-1)}</p>
      <div class="map" aria-label="Route from the recipient in Vancouver to the tracked gift in Seattle">
        <div class="map-grid"></div><div class="map-route"><span class="route-pulse"></span></div>
        <div class="map-label label-vancouver">VANCOUVER</div>
        <div class="map-pin recipient-pin"><span></span></div>
        <div class="map-coordinate coordinate-vancouver">KRIS · 49° 16′ N</div>
        <div class="map-label label-seattle">SEATTLE</div>
        <div class="map-pin gift-pin"><span></span></div>
        <div class="map-coordinate coordinate-seattle">GIFT · 47° 36′ N</div>
      </div>
      <div class="location-result">
        <div><span class="data-label">${copy.locationLabel}</span><strong>${copy.location}</strong></div>
        <div><span class="data-label">${copy.giftLabel}</span><strong class="warning">${copy.giftLocation}</strong></div>
        <div><span class="data-label">${copy.etaLabel}</span><strong>${copy.eta}</strong></div>
      </div>
      <p class="privacy-note">${copy.locationNote}</p>
      <button class="action" data-action="signal">${copy.locationButton}<span aria-hidden="true">↗</span></button>
    </section>
    <footer><span>RECIPIENT: VANCOUVER</span><span>PARCEL: SEATTLE</span></footer>`,

  localizing: () => `
    <header class="masthead">${backButton()}<span class="stamp">${copy.eyebrow}</span><span class="tracking">LIVE COURIER SCAN</span></header>
    <section class="panel loading-panel">
      <p class="overline">${copy.locationTitle}</p>
      <div class="scan-radar" aria-hidden="true"><span class="radar-sweep"></span><i class="radar-dot"></i><b>?</b></div>
      <h1 class="loading-message">${copy.locatingSteps[state.localizationStep]}</h1>
      <p class="scan-progress-label">SCAN ${String(state.localizationStep + 1).padStart(2, "0")} / ${String(copy.locatingSteps.length).padStart(2, "0")} · ${Math.round((state.localizationStep + 1) * 100 / copy.locatingSteps.length)}%</p>
      <div class="signal-meter"><span class="localization-meter" style="width:${Math.round((state.localizationStep + 1) * 100 / copy.locatingSteps.length)}%"></span></div>
      <p class="sensor-note">Birthday-courier localization service · taking this very seriously</p>
    </section>
    <footer><span>SEARCHING: VANCOUVER AREA</span><span>NO PERMISSION REQUIRED</span></footer>`,

  signal: () => `
    <header class="masthead">${backButton()}<span class="stamp">REMOTE DELIVERY PROTOCOL</span><span class="tracking">SIGNAL ${String(state.charge).padStart(2, "0")}%</span></header>
    <section class="panel signal-panel">
      <p class="overline">CONNECTION ATTEMPT ${String(state.question + 1).padStart(2, "0")}</p>
      <h1>${copy.signalTitle}</h1>
      <p class="body-copy">${copy.signalText}</p>
      <div class="signal-instrument" data-action="tune" role="button" tabindex="0" aria-label="Tap to tune birthday signal">
        <div class="dial-ring"><div class="dial-center"><span class="dial-needle"></span><b>${state.charge}%</b></div></div>
        <span class="dial-caption">${copy.signalHint}</span>
        <span class="dial-dot dot-one"></span><span class="dial-dot dot-two"></span>
      </div>
      <div class="signal-meter"><span style="width:${state.charge}%"></span></div>
      <div class="signal-actions">
        <button class="action secondary" data-action="tilt">${state.sensor ? copy.tiltOn : copy.enableTilt}</button>
        <button class="action" data-action="tune">${copy.tapTune}<span aria-hidden="true">＋</span></button>
      </div>
      <p class="sensor-note">${copy.reducedHint}</p>
    </section>
    <footer><span>NO LOCATION SENSOR USED</span><span>VERY SECURE (ISH)</span></footer>`,

  connectionLoading: () => `
    <header class="masthead">${backButton()}<span class="stamp">REMOTE DELIVERY PROTOCOL</span><span class="tracking">RETRYING SIGNAL</span></header>
    <section class="panel loading-panel initial-connection-panel">
      <p class="overline">SECURE BIRTHDAY CONNECTION</p>
      <div class="reconnect-animation" aria-hidden="true"><span></span><span></span><span></span></div>
      <h1 class="loading-message">${copy.connectionLoadingTitle}</h1>
      <p class="body-copy">${copy.connectionLoadingText}</p>
      <div class="signal-meter"><span class="initial-connection-meter"></span></div>
    </section>
    <footer><span>PACKAGE STILL IN SEATTLE</span><span>PLEASE HOLD YOUR BIRTHDAY</span></footer>`,

  connectionLost: () => `
    <header class="masthead">${backButton()}<span class="stamp">REMOTE DELIVERY PROTOCOL</span><span class="tracking">SIGNAL: LOST</span></header>
    <section class="panel connection-lost-panel">
      <p class="overline">REMOTE DELIVERY INTERRUPTED</p>
      <div class="lost-signal-mark" aria-hidden="true"><span>×</span></div>
      <h1>${copy.connectionLostTitle}</h1>
      <p class="body-copy">${copy.connectionLostText}</p>
      <button class="action" data-action="begin-questions">${copy.connectionLostButton}<span aria-hidden="true">↗</span></button>
    </section>
    <footer><span>4 QUESTIONS TO GO</span><span>COURIER AWAITS YOUR INPUT</span></footer>`,

  question: () => questionScreen(),

  recovering: () => `
    <header class="masthead">${backButton()}<span class="stamp">REMOTE DELIVERY PROTOCOL</span><span class="tracking">RETRY ${String(state.question + 1).padStart(2, "0")} / 04</span></header>
    <section class="panel loading-panel initial-connection-panel recovering-panel">
      <p class="overline">SIGNAL LOST · ATTEMPT ${String(state.question).padStart(2, "0")} FAILED</p>
      <div class="reconnect-animation" aria-hidden="true"><span></span><span></span><span></span></div>
      <h1 class="loading-message">${copy.reconnectTitle}</h1>
      <p class="body-copy reconnect-status">${copy.reconnectSteps[state.reconnectStep ?? 0]}</p>
      <div class="signal-meter"><span class="reconnect-meter"></span></div>
    </section>
    <footer><span>PACKAGE STILL IN SEATTLE</span><span>PLEASE HOLD YOUR BIRTHDAY</span></footer>`,

  reveal: () => `
    <header class="masthead">${backButton()}<span class="stamp">${copy.revealEyebrow}</span><span class="tracking">SIGNED: KRIS</span></header>
    <section class="panel reveal-panel">
      <div class="reveal-seal" aria-hidden="true">DELIVERED<br><b>✳</b></div>
      <p class="overline">THE ACTUAL BIRTHDAY PRESENT</p>
      <h1>${copy.revealTitle}</h1>
      <p class="body-copy reveal-copy">${copy.revealText}</p>
      <a class="action gift-link" href="../couples/">${copy.openGift}<span aria-hidden="true">↗</span></a>
    </section>
    <footer><span>ETA: THREE MONTHS</span><span>GAME: AVAILABLE NOW</span></footer>`,
};

function questionScreen() {
  const item = questions[state.question];
  return `
    <header class="masthead">${backButton()}<span class="stamp">${copy.legalLabel}</span><span class="tracking">FORM ${String(state.question + 1).padStart(2, "0")} / 04</span></header>
    <section class="panel question-panel gag-${item.gag}">
      <div class="signal-break"><span></span> ${state.question === 0 ? "SIGNAL LOST" : "SIGNAL LOST AGAIN"} <span></span></div>
      <p class="overline">${copy.legalLabel}</p>
      <h1>${formatQuestion(item.wording)}</h1>
      <div class="answer-stage">
        <button class="answer yes" data-action="yes">${copy.yes}</button>
        <div class="no-wrap no-${item.gag}">
          <button class="answer no" data-action="no" ${item.gag === "elephant" ? 'disabled aria-label="No is covered by an elephant"' : ""}>${copy.no}</button>
          ${gagArt(item.gag)}
        </div>
      </div>
      <p class="gag-message" aria-live="polite">${item.gag === "elephant" ? copy.elephantMessage : ""}</p>
      ${item.gag === "terms" && state.termsOpen ? termsDocument() : ""}
    </section>
    <footer><span>CONNECTION RECOVERY REQUIRED</span><span>PLEASE ANSWER HONESTLY</span></footer>`;
}

function termsDocument() {
  const clauses = Array.from({ length: 240 }, (_, index) => {
    const sentences = [
      "The birthday recipient acknowledges that all sweater-related claims shall be reviewed by an independent panda panel.",
      "Television rights include, but are not limited to, the remote, the good couch cushion, and saying ‘one more episode.’",
      "Any snack observed by the courier may be classified as shared property, pending review by the snack tribunal.",
      "The word ‘soon’ shall be interpreted according to the slowest available clock in the household.",
      "All massage requests remain subject to the availability of hands, cushions, and a reasonable amount of dramatic sighing.",
      "Dinner decisions may be made by menu, coin toss, weather pattern, or a very small committee of indecisive ghosts.",
      "The courier accepts no liability for boxes retained because they are, objectively, very good boxes.",
      "Any disagreement about the above shall be settled over snacks and not by consulting this document again.",
    ];
    const detail = index === 217
      ? "The courier’s emergency socks, issued only during multi-city birthday retrievals, are dark plum."
      : sentences[index % sentences.length];
    return `<p>${detail}</p>`;
  }).join("");
  return `<details class="terms" open>
    <summary>${copy.termsTitle} · 240 PARAGRAPHS</summary>
    <div class="terms-scroll"><p>${copy.termsInstruction}</p><p>${copy.termsBody}</p>${clauses}
      <label class="terms-answer-label" for="terms-answer">Enter your answer to decline:</label>
      <div class="terms-answer-row"><input id="terms-answer" name="terms-answer" autocomplete="off" autocapitalize="characters" maxlength="12"><button type="button" data-action="terms-answer-submit">Submit</button></div>
      <p class="terms-feedback" aria-live="polite"></p>
      <button class="terms-accept" type="button" data-action="terms-accept">${copy.termsButton}</button>
    </div>
  </details>`;
}

function gagArt(gag) {
  if (gag === "elephant") return `<img class="elephant" src="assets/elephant.png" alt="A large elephant covering the No button">`;
  if (gag === "drone") return `<div class="drone" aria-hidden="true"><svg viewBox="0 0 160 100"><path d="M49 52h61l-9 23H58Z" fill="currentColor"/><path d="M80 50V34m-30 2H27m103 0h-23" stroke="currentColor" stroke-width="5"/><path d="M18 35h18m84 0h18" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="27" cy="35" r="13" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="133" cy="35" r="13" fill="none" stroke="currentColor" stroke-width="4"/><path d="M78 76v10m-8 0h16m-13 0v5c0 4 8 4 8 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg></div>`;
  return "";
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function formatQuestion(value) {
  return escapeHtml(value).replace("Say Yes to the Dress", "<em>Say Yes to the Dress</em>");
}

function startMotion() {
  if (!state.sensor || state.motionAttached) return;
  state.motionAttached = true;
  window.addEventListener("deviceorientation", onOrientation, { passive: true });
}

function onOrientation(event) {
  if (state.screen !== "signal" || event.gamma == null) return;
  const centered = Math.abs(event.gamma) < 12;
  if (centered) {
    state.charge = Math.min(100, state.charge + 2);
  } else {
    state.charge = Math.max(0, state.charge - 1);
  }
  updateDial();
  if (state.charge >= 100) loseSignal();
}

function updateDial() {
  const dial = app.querySelector(".dial-center");
  const fill = app.querySelector(".signal-meter span");
  const count = app.querySelector(".tracking");
  if (dial) dial.querySelector("b").textContent = `${state.charge}%`;
  if (fill) fill.style.width = `${state.charge}%`;
  if (count) count.textContent = `SIGNAL ${String(state.charge).padStart(2, "0")}%`;
}

function loseSignal() {
  window.removeEventListener("deviceorientation", onOrientation);
  state.motionAttached = false;
  state.sensor = false;
  state.charge = 0;
  state.reconnectStep = 0;
  state.noAttempts = 0;
  if (state.questionsStarted) {
    state.screen = "question";
    render();
  } else {
    state.screen = "connectionLoading";
    render();
    window.setTimeout(() => {
      if (state.screen !== "connectionLoading") return;
      state.screen = "connectionLost";
      render();
    }, 3500);
  }
  if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
}

function attemptNo(button, gag) {
  const message = app.querySelector(".gag-message");
  const wrap = button.closest(".no-wrap");
  if (message) message.textContent = gag === "runaway" ? "" : copy[{ elephant: "noElephant", terms: "noTerms", drone: "noDrone" }[gag]];
  if (gag === "runaway" && wrap) {
    state.noAttempts += 1;
    const distance = Math.min(380, 150 + state.noAttempts * 62);
    const x = Math.round((Math.random() - 0.5) * distance);
    const y = Math.round((Math.random() - 0.5) * distance * 0.62);
    wrap.style.setProperty("--dodge-x", `${x}px`);
    wrap.style.setProperty("--dodge-y", `${y}px`);
    wrap.classList.remove("dodge");
    requestAnimationFrame(() => wrap.classList.add("dodge"));
  }
  if (gag === "elephant") {
    button.disabled = true;
    if (message) message.textContent = copy.elephantMessage;
  }
  if (gag === "terms") {
    state.termsOpen = true;
    const details = app.querySelector(".terms");
    if (details) details.open = true;
    else render();
  }
  if (gag === "drone" && wrap) {
    state.droneTriggered = true;
    wrap.classList.add("drone-flight");
  }
}

function acceptYes() {
  state.termsOpen = false;
  const next = nextQuestionIndex(state.question);
  if (next === null) state.screen = "reveal";
  else {
    state.question = next;
    state.reconnectStep = 0;
    state.screen = "recovering";
  }
  render();
  if (state.screen === "recovering") runRecovery();
}

function runRecovery() {
  const update = () => {
    if (state.screen !== "recovering") return;
    if (state.reconnectStep < copy.reconnectSteps.length - 1) {
      state.reconnectStep += 1;
      render();
      window.setTimeout(update, 1800);
      return;
    }
    loseSignal();
  };
  window.setTimeout(update, 1800);
}

function runLocalization() {
  const update = () => {
    if (state.screen !== "localizing") return;
    if (state.localizationStep < copy.locatingSteps.length - 1) {
      state.localizationStep += 1;
      render();
      window.setTimeout(update, 2800);
      return;
    }
    state.screen = "location";
    render();
  };
  window.setTimeout(update, 2800);
}

app.addEventListener("click", async (event) => {
  const control = event.target.closest("[data-action]");
  if (!control) return;
  const action = control.dataset.action;
  if (action === "locate") {
    state.localizationStep = 0;
    state.screen = "localizing";
    render();
    runLocalization();
  } else if (action === "back") {
    window.removeEventListener("deviceorientation", onOrientation);
    state.motionAttached = false;
    if (state.screen === "localizing" || state.screen === "location") state.screen = "start";
    else if (state.screen === "signal") state.screen = "location";
    else if (state.screen === "connectionLoading" || state.screen === "connectionLost") state.screen = "signal";
    else if (state.screen === "recovering" && state.question > 0) {
      state.question -= 1;
      state.screen = "question";
    }
    else if (state.screen === "question" && state.question > 0) state.question -= 1;
    else if (state.screen === "question") state.screen = "signal";
    else if (state.screen === "reveal") {
      state.screen = "question";
      state.droneTriggered = false;
    }
    state.charge = 0;
    state.sensor = false;
    state.termsOpen = false;
    render();
  } else if (action === "signal") {
    state.screen = "signal";
    render();
  } else if (action === "begin-questions") {
    state.questionsStarted = true;
    state.question = 0;
    state.screen = "question";
    render();
  } else if (action === "tune") {
    state.charge = Math.min(100, state.charge + 25);
    updateDial();
    if (state.charge >= 100) loseSignal();
  } else if (action === "tilt") {
    const orientation = window.DeviceOrientationEvent;
    try {
      if (orientation && typeof orientation.requestPermission === "function") {
        const permission = await orientation.requestPermission();
        if (permission !== "granted") throw new Error("Motion permission was not granted");
      } else if (!orientation) {
        throw new Error("Motion sensor unavailable");
      }
      state.sensor = true;
      control.textContent = copy.tiltOn;
      startMotion();
    } catch {
      control.textContent = copy.tapTune;
      control.classList.add("sensor-unavailable");
      app.querySelector(".sensor-note").textContent = copy.reducedHint;
    }
  } else if (action === "yes") {
    acceptYes();
  } else if (action === "no") {
    attemptNo(control, questions[state.question].gag);
  } else if (action === "terms-accept") {
    state.termsOpen = false;
    acceptYes();
  } else if (action === "terms-answer-submit") {
    const input = app.querySelector("#terms-answer");
    const feedback = app.querySelector(".terms-feedback");
    if (input.value.trim().toLowerCase().replace(/\s+/g, " ") === "dark plum") {
      feedback.textContent = copy.termsRight;
      window.setTimeout(() => {
        if (state.screen === "question" && state.termsOpen) {
          state.termsOpen = false;
          acceptYes();
        }
      }, 1400);
    } else {
      feedback.textContent = copy.termsWrong;
      input.value = "";
    }
  }
});

app.addEventListener("pointerenter", (event) => {
  const no = event.target.closest?.(".gag-runaway .no");
  if (no && event.pointerType === "mouse") attemptNo(no, "runaway");
}, true);

app.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".signal-instrument")) {
    event.preventDefault();
    state.charge = Math.min(100, state.charge + 25);
    updateDial();
    if (state.charge >= 100) loseSignal();
  }
});

render();
