import thenify = require('thenify');
const { withCallback } = thenify;

// multiple args with callback
{
  const multiArgs = thenify((a: number, b: number, c: number, callback: (err: unknown, a: number, b: number, c: number) => void) => {
    callback(null, a + 1, b + 1, c + 1);
  }, { withCallback: true });

  // $ExpectType Promise<[err: unknown, a: number, b: number, c: number]>
  multiArgs(5, 6, 7);

  // $ExpectType Promise<(string | number)[] | undefined>
  multiArgs(5, 6, 7).then(([_, a, b, c]) => [a, b, c, "cat"]).catch(() => void 0);

  // $ExpectType void
  multiArgs(6, 7, 8, ([_, a, b, c]) => [a, b, c, "dog"]);

  // @ts-expect-error
  multiArgs(5, 3);
}

// single arg with callback
{
  const singleArg = thenify((num: number, callback: (num: number) => unknown) => {
    callback(num / 2);
  }, { withCallback: true });

  // $ExpectType Promise<number[]>
  singleArg(4).then(n => [n * 5]);

  // $ExpectType void
  singleArg(2, x => x + 2);
}

// single arg with withCallback
{
  const singleArgWithCallback = withCallback((num: number, callback: (num: number) => unknown) => {
    callback(num / 2);
  });

  // $ExpectType Promise<number[]>
  singleArgWithCallback(4).then(n => [n * 5]);

  // $ExpectType void
  singleArgWithCallback(2, x => x + 2);
}

// no args with callback
{
  const noArg = thenify((callback: () => unknown) => {
    callback();
  }, { withCallback: true });

  // $ExpectType Promise<undefined>
  noArg().then(() => void 0);

  // $ExpectType void
  noArg(() => void 0);
}

// no args without callback
{
  const noWithCallback = thenify((callback: () => void) => {
    callback();
  });

  // $ExpectType Promise<undefined>
  noWithCallback().then(() => void 0);

  // @ts-expect-error
  noWithCallback(() => void 0);
}