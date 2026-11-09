import test from "node:test";
import assert from "node:assert/strict";
import { mountScrollMotion } from "../src/lib/scrollMotion.ts";

function environment(reduced = false) {
  const listeners = new Set();
  const media = {
    matches: reduced,
    addEventListener: (_, cb) => listeners.add(cb),
    removeEventListener: (_, cb) => listeners.delete(cb),
  };
  const visible = {
    dataset: {},
    getBoundingClientRect: () => ({ top: 20 }),
    removeAttribute() {
      delete this.dataset.reveal;
    },
  };
  const below = {
    dataset: {},
    getBoundingClientRect: () => ({ top: 1500 }),
    removeAttribute() {
      delete this.dataset.reveal;
    },
  };
  let callback;
  const observed = new Set();
  let disconnected = false;
  class Observer {
    constructor(cb) {
      callback = cb;
    }
    observe(element) {
      observed.add(element);
    }
    unobserve(element) {
      observed.delete(element);
    }
    disconnect() {
      disconnected = true;
      observed.clear();
    }
  }
  const originalWindow = globalThis.window;
  const originalObserver = globalThis.IntersectionObserver;
  globalThis.window = {
    innerHeight: 800,
    matchMedia: () => media,
    IntersectionObserver: Observer,
  };
  globalThis.IntersectionObserver = Observer;
  return {
    root: { querySelectorAll: () => [visible, below] },
    below,
    visible,
    observed,
    media,
    enter: () => callback([{ isIntersecting: true, target: below }]),
    reduce: () => {
      media.matches = true;
      for (const listener of listeners) listener();
    },
    disconnected: () => disconnected,
    restore: () => {
      globalThis.window = originalWindow;
      globalThis.IntersectionObserver = originalObserver;
    },
  };
}
test("reduced motion keeps all content visible", () => {
  const env = environment(true);
  try {
    mountScrollMotion(env.root)();
    assert.deepEqual(env.below.dataset, {});
    assert.equal(env.observed.size, 0);
  } finally {
    env.restore();
  }
});
test("reveals below-fold content once, without hiding the current viewport", () => {
  const env = environment();
  try {
    const cleanup = mountScrollMotion(env.root);
    assert.deepEqual(env.visible.dataset, {});
    assert.equal(env.below.dataset.reveal, "pending");
    env.enter();
    assert.equal(env.below.dataset.reveal, "visible");
    assert.equal(env.observed.size, 0);
    cleanup();
    assert.deepEqual(env.below.dataset, {});
    assert.equal(env.disconnected(), true);
  } finally {
    env.restore();
  }
});
test("changing motion preference reveals pending content immediately", () => {
  const env = environment();
  try {
    mountScrollMotion(env.root);
    env.reduce();
    assert.deepEqual(env.below.dataset, {});
    assert.equal(env.disconnected(), true);
  } finally {
    env.restore();
  }
});
