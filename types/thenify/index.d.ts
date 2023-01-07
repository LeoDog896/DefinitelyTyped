// Type definitions for thenify 3.3
// Project: https://github.com/thenables/thenify#readme
// Definitions by: Tristan F. <https://github.com/LeoDog896>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface ThenifyOptions {
    withCallback?: boolean;
    multiArgs?: boolean | string[];
}

/** De-expand the tuple if it only has one argument -- [T] becomes T, while [A, T] remains [A, T] */
type ArgDexpansion<Arg> = Arg extends [unknown] ? Arg[0] : Arg;

// Defines an interface with function overloads, that way the legacy callback support also works.
interface ThenifyReturnFunction<Args extends unknown[], CallbackArgs extends unknown[]> {
    (...args: Args): Promise<ArgDexpansion<CallbackArgs>>;
    (...args: [...Args, (args: ArgDexpansion<CallbackArgs>) => void]): void;
}

declare function thenify<
    // The function's args, ex (a, b, c, callback) will be (a, b, c)
    Args extends unknown[],
    CallbackArgs extends unknown[],
>(
    // Extract information from the passed object:
    // ex with (a, b, c, callback), Args = [a, b, c]
    // and CallbackArgs is the arguments in the callback
    fn: (...params: [...Args, (...args: CallbackArgs) => void]) => unknown,
    options?: ThenifyOptions
): ThenifyReturnFunction<Args, CallbackArgs>;

export = thenify;

declare namespace thenify {
    function foo(): void;
}
