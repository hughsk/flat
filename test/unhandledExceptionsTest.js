import assert from "node:assert";
import { describe, test } from "node:test";
import { flatten, unflatten } from "../index.js";

describe("flatten obj tests", function () {
  test("Flatten null", function () {
    assert.deepStrictEqual(flatten(null), null);
  });

  test("Flatten undefined", function () {
    assert.deepStrictEqual(flatten(undefined), undefined);
  });

  test("Flatten object with Symbol keys", function () {
    const sym = Symbol("test");
    const obj = { [sym]: "value", regularKey: "regularValue" };
    const flatObj = flatten(obj);

    assert.strictEqual(flatObj["Symbol(test)"], "value"); // Assuming stringification of symbol keys
  });

  test("Flatten circular reference", function () {
    const obj = { name: "John" };
    obj.self = obj; // Circular reference

    assert.throws(() => flatten(obj), /Circular reference detected/);
  });
});
