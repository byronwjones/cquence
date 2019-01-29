class PrivateComposerAPI {
    constructor(self:Composer){
        this.self = self;
        this.rootBuilder = new LinearSequenceConductorBuilder();
        this.currentBuilder = this.rootBuilder;
        this.builderStack = [this.currentBuilder];
    }

    self: Composer;
    rootBuilder: LinearSequenceConductorBuilder;
    currentBuilder: IConductorBuilder;
    builderStack: IConductorBuilder[];

    getLastTargetOnCurrentBuilder(): ExecutionTarget {
        //get the last execution target in the current builder's sequence
        let cb = this.currentBuilder;
        if (!!cb.sequence) {
            return cb.sequence[cb.sequence.length - 1];
        }
        else { //current builder is a conditional builder (the only builder without a sequence property)
            var cq = cb.currentCondition.sequence;
            return cq[cq.length - 1];
        }
    }

    changeCurrentBuilder(builder: IConductorBuilder): IConductorBuilder {
        // a new builder is always an execution target in the sequence of the previous current builder
        //  -- it is its child
        this.currentBuilder.add(builder);
        this.builderStack.push(builder);
        this.currentBuilder = builder;

        return builder;
    }

    configureSequence(compositionFn: CompositionFunction): void {
        //run the composition function that defines the sequence that goes in the current builder
        compositionFn(this.self);

        this.builderStack.pop();
        this.currentBuilder = this.builderStack[this.builderStack.length - 1];
    }

    whileOrDoWhile(predicate: any, doWhile: boolean, compositionFn: CompositionFunction): Composer {
        this.changeCurrentBuilder(new WhileSequenceConductorBuilder(predicate, doWhile));
        this.configureSequence(compositionFn);

        return this.self;
    }

    compile (promiseConstructor?: PromiseConstructorLike): VirtualFunction {
        let fn: VirtualFunction;
        let me = this;
        // create a function that returns a Promise
        if (utils.isFunction(promiseConstructor)) {
            fn = function (args: NormalMap, update: (updateDetail: any) => void) {
                return new promiseConstructor(function (resolve, reject) {
                    let builder = me.rootBuilder.build(null, args, resolve, reject, update);
                    builder.start(); //run virtual function
                });
            };
        }
        else {  // function that uses callbacks for feedback
           
            fn = function (objParams?: ICallbackVirtualFunctionParameters) {
                //guarantee valid value
                objParams = utils.isPrimitiveValue(objParams) ? {} : objParams;

                // perform task with given parameters
                let builder = me.rootBuilder.build(null, objParams.args, objParams.success,
                    objParams.error, objParams.update, objParams.completed);
                builder.start(); //run virtual function
            };
        }

        return fn;
    }
}