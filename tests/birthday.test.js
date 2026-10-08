import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { questions, nextQuestionIndex } from "../birthday/story.js";

test("the birthday delivery has the four approved questions and distinct No gags", () => {
  assert.equal(questions.length, 4);
  assert.deepEqual(questions.map((question) => question.gag), ["runaway", "elephant", "terms", "drone"]);
  assert.match(questions[0].wording, /green panda sweater/);
  assert.doesNotMatch(questions[0].wording, /For legal reasons/);
  assert.match(questions[1].wording, /100% of the TV rights/);
  assert.match(questions[1].wording, /Say Yes to the Dress/);
  assert.match(questions[2].wording, /give massages on request for the rest of her life/);
  assert.match(questions[3].wording, /not saying ‘I don’t know’/);
});

test("the elephant uses the supplied PNG and the drone uses inline SVG", async () => {
  for (const image of ["elephant"]) {
    const bytes = await readFile(new URL(`../birthday/assets/${image}.png`, import.meta.url));
    assert.deepEqual([...bytes.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  }
  const app = await readFile(new URL("../birthday/birthday.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../birthday/birthday.css", import.meta.url), "utf8");
  const drone = app.match(/if \(gag === "drone"\) return `([^`]+)`/)?.[1];
  assert.ok(drone, "inline drone SVG exists");
  assert.doesNotMatch(drone, /#ef5b47|<rect/);
  assert.match(styles, /\.gag-drone \.drone \{[^}]*top: -100vh/);
  assert.match(styles, /drone-lift 3\.6s 1\.3s ease-in-out forwards/);
  assert.match(styles, /drone-lift 3\.6s 1\.3s ease-in-out forwards/);
  assert.match(styles, /@keyframes drone-arrive[\s\S]*translate\(-50%, calc\(100vh - 88px\)\)/);
  assert.match(styles, /@keyframes drone-lift[\s\S]*translate\(0, -48px\)[\s\S]*translate\(112vw, -150px\)/);
});

test("birthday UI shows scan progress and does not narrate the runaway No gag", async () => {
  const app = await readFile(new URL("../birthday/birthday.js", import.meta.url), "utf8");
  const styles = await readFile(new URL("../birthday/birthday.css", import.meta.url), "utf8");
  assert.match(app, /SCAN \$\{String\(state\.localizationStep \+ 1\)/);
  assert.match(app, /window\.setTimeout\(update, 2800\)/);
  assert.match(app, /RECIPIENT LOCATION/);
  assert.doesNotMatch(app, /The button has received legal advice/);
  assert.match(app, /state\.question === 0 \? "SIGNAL LOST" : "SIGNAL LOST AGAIN"/);
  assert.doesNotMatch(app, /PLEASE SIGN WITH A CRAYON/);
  assert.match(app, /questions\[state\.question\]\.gag === "drone"/);
  assert.ok(app.includes("To decline this offer, answer the question: what color are the courier’s emergency socks? The answer is in the terms and conditions below."));
  assert.match(app, /\}, 1000\);/);
  assert.match(app, /\}, 3500\);/);
  const recovery = app.match(/function runRecovery\(\) \{([\s\S]*?)\n\}/)?.[1];
  assert.ok(recovery, "recovery flow exists");
  assert.doesNotMatch(recovery, /state\.screen = "signal"/);
  assert.match(recovery, /window\.setTimeout\(update, 1800\)/);
  assert.match(recovery, /loseSignal\(\)/);
  assert.match(app, /<section class="panel loading-panel initial-connection-panel recovering-panel">/);
  assert.match(app, /reconnectTitle: "Trying to recover the birthday signal…"/);
  assert.doesNotMatch(app, /<span><\/span><span><\/span><span><\/span><i>↗<\/i>/);
  assert.match(styles, /initial-connection-progress 3\.4s/);
  assert.match(styles, /\.reconnect-meter \{ width: 8%; animation: initial-connection-progress 2\.5s/);
  assert.match(app, /item\.gag === "terms" && state\.termsOpen \? termsDocument\(\) : ""/);
  assert.match(app, /length: 240/);
  assert.match(app, /index === 217/);
  assert.match(app, /dark plum/);
  assert.doesNotMatch(app, /8,492\(b\)|BL-17/);
  assert.match(app, /Sorry, there's an elephant covering the button\./);
  assert.match(styles, /\.gag-elephant \.no-wrap \{ width: 160px; min-width: 0; height: 58px/);
  assert.match(styles, /\.gag-elephant \.elephant \{ position: absolute; z-index: 3; top: 50%; left: 50%; width: 160px; height: auto; max-width: none; max-height: 25vh; object-fit: contain/);
  assert.match(styles, /\.gag-elephant \.gag-message \{ position: absolute; z-index: 4; right: 24px; bottom: 18px; left: 24px;[\s\S]*?border: 0;[\s\S]*?background: transparent;[\s\S]*?font: 10px\/1\.4 var\(--mono\)/);
  assert.match(styles, /\.gag-elephant \.gag-message \{ position: absolute; z-index: 4; right: 24px; bottom: 18px/);
  assert.doesNotMatch(styles, /@keyframes elephant-cover/);
});

test("the last legal question leads to the reveal instead of another question", () => {
  assert.equal(nextQuestionIndex(0), 1);
  assert.equal(nextQuestionIndex(2), 3);
  assert.equal(nextQuestionIndex(3), null);
});
