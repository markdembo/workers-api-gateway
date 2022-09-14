import handler, { Env } from "../src/index";
import { MOCK_LIST_ENDPOINTS } from "../src/admin/list-endpoint";
import { ExecutionContext } from "./execution-context";

test("should throw 403 without admin key", async () => {
  const env = getMiniflareBindings() as Env;
  const ctx = new ExecutionContext();
  const res = await handler.fetch(
    new Request("http://localhost/list"),
    env,
    ctx
  );
  expect(res.status).toBe(401);
});

test("should return 200 with admin key with response body", async () => {
  const env = getMiniflareBindings() as Env;
  const ctx = new ExecutionContext();
  const res = await handler.fetch(
    new Request("http://localhost/list"),
    env,
    ctx
  );
  expect(res.status).toBe(200);
  expect(res.json()).toBe({ items: MOCK_LIST_ENDPOINTS });
});
