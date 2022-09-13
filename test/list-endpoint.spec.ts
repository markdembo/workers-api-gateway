import handler, { Env } from "../src/index";
import { Miniflare } from "miniflare";
import { MOCK_LIST_ENDPOINTS } from "../src/admin/list-endpoint";

class ExecutionContext {
  promises: Promise<any>[] = [];
  waitUntil(promise: Promise<any>) {
    this.promises.push(promise);
  }
  passThroughOnException() {}
}

const mf = new Miniflare({
  envPath: true,
  packagePath: true,
  wranglerConfigPath: true,
  scriptPath: "dist/index.mjs",
});

const env = getMiniflareBindings() as Env;

test("should throw 403 without admin key", async () => {
  const ctx = new ExecutionContext();
  const res = await handler.fetch(
    new Request("http://localhost/list"),
    env,
    ctx
  );
  expect(res.status).toBe(401);
});

test("should return 200 with admin key with response body", async () => {
  const ctx = new ExecutionContext();
  const res = await handler.fetch(
    new Request("http://localhost/list"),
    env,
    ctx
  );
  expect(res.status).toBe(200);
  expect(res.json()).toBe({ items: MOCK_LIST_ENDPOINTS });
});
