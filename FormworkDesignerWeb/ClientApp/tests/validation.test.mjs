import test from "node:test";
import assert from "node:assert/strict";
import { validateInquiry, normalizePhone } from "../src/lib/validation.ts";
const valid = {
  fullName: "Анна Иванова",
  email: "anna@example.org",
  phone: "+375 (29) 123-45-67",
  consent: true,
};
test("valid Belarus and Russian inquiries", () => {
  assert.deepEqual(validateInquiry(valid), {});
  assert.deepEqual(
    validateInquiry({ ...valid, phone: "8 (916) 123-45-67" }),
    {}
  );
  assert.equal(normalizePhone(valid.phone), "+375291234567");
});
test("rejects absent consent and invalid contacts", () => {
  assert.ok(validateInquiry({ ...valid, consent: false }).consent);
  for (const phone of [
    "+7 701 123 45 67",
    "+37500 1234567",
    "+37529abc1234567",
    "",
  ])
    assert.ok(validateInquiry({ ...valid, phone }).phone);
  assert.ok(validateInquiry({ ...valid, email: "a@" }).email);
});
test("accepts names without assuming three words", () => {
  assert.deepEqual(validateInquiry({ ...valid, fullName: "Анна-Мария" }), {});
  assert.ok(validateInquiry({ ...valid, fullName: "а".repeat(201) }).fullName);
});
