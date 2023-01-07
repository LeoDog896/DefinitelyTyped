// Type definitions for thenify 3.3
// Project: https://github.com/thenables/thenify#readme
// Definitions by: Tristan F. <https://github.com/LeoDog896>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

type MultiArg = boolean | string[] | undefined;

interface ThenifyOptions {
    withCallback?: boolean;
    multiArgs?: MultiArg;
}

/** De-expand the tuple if it only has one argument -- [T] becomes T, while [A, T] remains [A, T] */
type ArgDexpansion<Arg> = Arg extends [unknown] ? Arg[0] : Arg;

// boolean | string[] | undefined -> boolean | string[]
type MultiArgNarrower<M extends MultiArg> = M extends undefined ? true : M;

type ConditionalArgDexpansion<Arg, MultiArgs extends boolean | string[] | undefined> = 
    // If multiArgs is true, de-expand the tuple when possible but leave it as a tuple if it has multiple arguments
    MultiArgNarrower<MultiArgs> extends true ? ArgDexpansion<Arg> : 
    // If multiArgs is false, just return the first argument
    MultiArgNarrower<MultiArgs> extends false ? (Arg extends [unknown] ? Arg[0] : Arg) : 
    // If multiArgs is a string[], de-expand the tuple when possible but leave it as a tuple if it has multiple arguments
    // MultiArgNarrower<MultiArgs> extends string[] ? { [K in MultiArgNarrower<MultiArgs>[number]]: ArgDexpansion<Arg>[number] } : never;
    never;
interface ThenifyPromiseReturnFunction<Args extends unknown[], CallbackArgs extends unknown[], MultiArgs extends boolean | string[] | undefined> {
    (...args: Args): Promise<ArgDexpansion<CallbackArgs>>;
}

// Adds legacy callback support
interface ThenifyReturnAllFunction<Args extends unknown[], CallbackArgs extends unknown[], MultiArgs extends boolean | string[] | undefined> extends ThenifyPromiseReturnFunction<Args, CallbackArgs, MultiArgs> {
    (...args: [...Args, (args: ArgDexpansion<CallbackArgs>) => void]): void;
}

declare function thenify<
    // The function's args, ex (a, b, c, callback) will be (a, b, c)
    Args extends unknown[],
    CallbackArgs extends unknown[],
    Options extends ThenifyOptions = ThenifyOptions
>(
    // Extract information from the passed object:
    // ex with (a, b, c, callback), Args = [a, b, c]
    // and CallbackArgs is the arguments in the callback
    fn: (...params: [...Args, (...args: CallbackArgs) => void]) => unknown,
    options?: Options,
): Options extends { withCallback: true }
    // return promise and callback-compatible function
    ? ThenifyReturnAllFunction<Args, CallbackArgs, Options["multiArgs"]> 
    // only return promise-compatible function
    : ThenifyPromiseReturnFunction<Args, CallbackArgs, Options["multiArgs"]>;

export = thenify;

declare namespace thenify {
    function withCallback<
        Args extends unknown[],
        CallbackArgs extends unknown[],
        Options extends { multiArgs?: MultiArg } = { multiArgs?: MultiArg }
    >(
        fn: (...params: [...Args, (...args: CallbackArgs) => void]) => unknown,
        options?: Options
    ): ThenifyReturnAllFunction<Args, CallbackArgs, Options["multiArgs"]>;
}
