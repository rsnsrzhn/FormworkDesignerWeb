import test from "node:test";
import assert from "node:assert/strict";
import { animatePageIntro } from "../src/lib/pageTransition.ts";
function setup({ reduced = false, hidden = false, broken = false } = {}) {
  const previous = { window: globalThis.window, document: globalThis.document };
  const animations = [];
  let cancelled = 0;
  globalThis.window = { matchMedia: () => ({ matches: reduced }) };
  globalThis.document = {
    visibilityState: hidden ? "hidden" : "visible",
    startViewTransition: () => {
      throw new Error("Page snapshots must not be used");
    },
  };
  const heading = {
    animate: (frames, options) => {
      if (broken) throw new Error("unsupported");
      animations.push({ frames, options });
      return { cancel: () => cancelled++ };
    },
  };
  return {
    heading,
    animations,
    cancelled: () => cancelled,
    restore: () => {
      globalThis.window = previous.window;
      globalThis.document = previous.document;
    },
  };
}
test("animates only heading opacity without snapshots, movement or a blank frame", () => {
  const env = setup();
  try {
    const cleanup = animatePageIntro(env.heading);
    assert.equal(env.animations.length, 1);
    assert.ok(env.animations[0].options.duration <= 180);
    assert.ok(
      env.animations[0].frames.every(
        (frame) =>
          Object.keys(frame).every((key) => key === "opacity") &&
          frame.opacity > 0
      )
    );
    cleanup();
    assert.equal(env.cancelled(), 1);
  } finally {
    env.restore();
  }
});
test("reduced motion and background tabs skip animations", () => {
  for (const options of [{ reduced: true }, { hidden: true }]) {
    const env = setup(options);
    try {
      animatePageIntro(env.heading)();
      assert.equal(env.animations.length, 0);
    } finally {
      env.restore();
    }
  }
});
test("unsupported animation and a missing heading never block the page", () => {
  const env = setup({ broken: true });
  try {
    assert.doesNotThrow(() => animatePageIntro(env.heading)());
    assert.doesNotThrow(() => animatePageIntro(null)());
    assert.doesNotThrow(() => animatePageIntro({})());
  } finally {
    env.restore();
  }
});
