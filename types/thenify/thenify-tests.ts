import thenify = require('thenify');

const multiArgs = thenify((a: number, b: number, c: number, callback: (err: unknown, a: number, b: number, c: number) => void) => {
  callback(null, a + 1, b + 1, c + 1);
}, { withCallback: true });


multiArgs(5, 6, 7).then(([_, a, b, c]) => [a, b, c, "cat"]).catch(() => void 0);
multiArgs(6, 7, 8, ([_, a, b, c]) => [a, b, c, "dog"]);

const singleArg = thenify((num: number, callback: (num: number) => unknown) => {
  callback(num / 2);
}, { withCallback: true })

singleArg(4).then(n => [n * 5])
singleArg(2, x => x + 2);

const noArg = thenify((callback: () => unknown) => {
  callback();
}, { withCallback: true })

noArg().then(() => void 0)
noArg(() => void 0)