class Composer {
    constructor(){
        this[privado] = new PrivateComposerAPI(this);
    }

    [key: string]: any;

    next(unitFunction: UnitFunction): Composer {
        let pvt = <PrivateComposerAPI>this[privado];
        let self = this;

        if (!utils.isFunction(unitFunction)) {  
            throw new TypeError("Argument provided to next(unitFunction) must be a function");
        }

        pvt.currentBuilder.add(unitFunction);

        return self;
    }

    if(predicate: any, compositionFn: CompositionFunction): Composer {
        let pvt = <PrivateComposerAPI>this[privado];
        let self = this;

        if (!utils.isFunction(compositionFn)) {
            throw new TypeError("Second argument provided to if(predicate, compositionFunction) must be a function");
        }

        pvt.changeCurrentBuilder(new ConditionalSequenceConductorBuilder(predicate));
        pvt.configureSequence(compositionFn);

        return self;
    }

    elseIf = function (predicate: any, compositionFn: CompositionFunction): Composer {
        let pvt = <PrivateComposerAPI>this[privado];
        let self = this;

        if (!utils.isFunction(compositionFn))
            throw new TypeError("Second argument provided to elseIf(predicate, compositionFunction) must be a function");

        var lastTarget = pvt.getLastTargetOnCurrentBuilder();

        //the last execution target in the current builder must be an open conditional conductor builder to use this method
        let conditionalBuilder = <ConditionalSequenceConductorBuilder>lastTarget;
        if (!conditionalBuilder || !conditionalBuilder.type ||
            conditionalBuilder.type !== ConductorBuilderType.CONDITIONAL) {
                throw new ReferenceError("An elseIf() statement must be preceded by an if() statement");
            }
        if (conditionalBuilder.isClosed) {
            throw new ReferenceError("An elseIf() statement is not allowed after an else() statement");
        }

        //update the current builder
        pvt.builderStack.push(conditionalBuilder);
        pvt.currentBuilder = conditionalBuilder;

        if (utils.isNullOrUndefined(predicate)) {
            predicate = false; // only else predicate argument can be null/undefined
        }
        conditionalBuilder.addCondition(predicate);
        pvt.currentBuilder.fnName = "elseIf()";

        pvt.configureSequence(compositionFn);

        return self;
    }

    else(compositionFn: CompositionFunction): Composer {
        let pvt = <PrivateComposerAPI>this[privado];
        let self = this;

        if (!utils.isFunction(compositionFn)) {
            throw new TypeError("Argument provided to if(predicate, compositionFunction) must be a function");
        }

        var lastTarget = pvt.getLastTargetOnCurrentBuilder();

        //the last execution target in the current builder must be an open conditional conductor builder to use this method
        let conditionalBuilder = <ConditionalSequenceConductorBuilder>lastTarget;
        if (!conditionalBuilder || !conditionalBuilder.type ||
            conditionalBuilder.type !== ConductorBuilderType.CONDITIONAL ||
            conditionalBuilder.isClosed) {
                throw new ReferenceError("An else() statement must be immediately preceded by an if() or elseIf() statement");
            }

        //update the current builder
        pvt.builderStack.push(conditionalBuilder);
        pvt.currentBuilder = conditionalBuilder;

        conditionalBuilder.addCondition();
        conditionalBuilder.fnName = "else()";

        pvt.configureSequence(compositionFn);

        return self;
    }

    forEach (objectOrArray: any, compositionFn: CompositionFunction): Composer {
        let pvt = <PrivateComposerAPI>this[privado];
        let self = this;

        if (!utils.isFunction(compositionFn))
            throw new TypeError("Second argument provided to forEach(objectOrArray, compositionFunction) must be a function");

        pvt.changeCurrentBuilder(new ForEachSequenceConductorBuilder(objectOrArray));
        pvt.configureSequence(compositionFn);

        return self;
    }

    while (predicate: any, compositionFn: CompositionFunction): Composer {
        let pvt = <PrivateComposerAPI>this[privado];

        if (!utils.isFunction(compositionFn)) {
            throw new TypeError("Second argument provided to while(predicate, compositionFunction) must be a function");
        }

        return pvt.whileOrDoWhile(predicate, false, compositionFn);
    }

    doWhile (predicate: any, compositionFn: CompositionFunction): Composer {
        let pvt = <PrivateComposerAPI>this[privado];

        if (!utils.isFunction(compositionFn)) {
            throw new TypeError("Second argument provided to doWhile(predicate, compositionFunction) must be a function");
        }

        return pvt.whileOrDoWhile(predicate, true, compositionFn);
    }
}