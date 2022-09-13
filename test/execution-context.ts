export class ExecutionContext {
  promises: Promise<any>[] = [];
  waitUntil(promise: Promise<any>) {
    this.promises.push(promise);
  }
  passThroughOnException() {}
}
