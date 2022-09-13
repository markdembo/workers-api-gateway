import handler from "../src/index";
import { ExecutionContext } from "./execution-context";

test("should throw 401 without API Key", async () => {
  const env = getMiniflareBindings();
  const ctx = new ExecutionContext();

  const res = await handler.fetch(new Request("http://localhost"), env, ctx);
  expect(res.status).toBe(401);
});
