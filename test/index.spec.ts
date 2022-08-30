import handler, { Env } from "../src/index";
import { Miniflare } from "miniflare";

class ExecutionContext {
    promises: Promise<any>[] = [];
    waitUntil(promise: Promise<any>) { this.promises.push(promise); }
    passThroughOnException() {}
  } 

test("should throw 403 without API Key", async () => {
  const mf = new Miniflare({
    envPath: true,
    packagePath: true,
    wranglerConfigPath: true,
    scriptPath: "dist/index.mjs"
    
  });
  const env = (getMiniflareBindings()) as Env;
  const ctx = new ExecutionContext();
  const res = await handler.fetch(
    new Request("http://localhost"),
    env,
    ctx
  );
  expect(res.status).toBe(403);
});
