class Cquence {
    
    composeFunction (compositionFn: CompositionFunction, promiseConstructor?: PromiseConstructorLike): VirtualFunction {
        if (!utils.isFunction(compositionFn)) {
            throw new TypeError("First argument provided to composeFunction(compositionFunction, [PromiseConstructor]) must be a function");
        }

        var composer = new Composer();
        compositionFn(composer);

        let pvt = <PrivateComposerAPI>composer[privado];
        return pvt.compile(promiseConstructor);
    }
}