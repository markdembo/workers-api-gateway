import { Env } from "../src/index";

declare global {
  function getMiniflareBindings(): Env;
  function getGlobalScope(): Promise<ExecutionContext>;
}

export {};
