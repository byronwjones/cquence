type NormalMap = {[key:string]: any};

declare namespace ConductorInterface {
    interface Linear {
        lets: NormalMap;
        error: (exception?: string | Error) => void;
        next: () => void;
        return: (returnValue: any) => void;
        update: (updateInfo: any) => void;
    }

    interface Iterating extends Linear {
        continue: () => void;
        break: () => void;
    }

    interface ForEach extends Iterating {
        $key: number | string;
        $object: any;
        $item: any;
    }
}

declare namespace UnitFunction {
    type Linear = (conductorUI: ConductorInterface.Linear) => void;
    type Iterating = (conductorUI: ConductorInterface.Iterating) => void;
    type ForEach = (conductorUI: ConductorInterface.ForEach) => void;
}

declare namespace CompositionFunction {
    type Linear = (composer: Composer.Linear) => void;
    type ForEach = (composer: Composer.ForEach) => void;
    type Iterating = (composer: Composer.Iterating) => void;
}

declare namespace Composer {
    interface ForEach {
        next (unitFunction: UnitFunction.ForEach): Composer.ForEach;
        if (predicate: any, compositionFn: CompositionFunction.Linear): Composer.ForEach;
        elseIf (predicate: any, compositionFn: CompositionFunction.Linear): Composer.ForEach;
        else (compositionFn: CompositionFunction.Linear): Composer.ForEach;
        forEach (objectOrArray: any, compositionFn: CompositionFunction.ForEach): Composer.ForEach;
        while (predicate: any, compositionFn: CompositionFunction.Iterating): Composer.ForEach;
        doWhile (predicate: any, compositionFn: CompositionFunction.Iterating): Composer.ForEach;
    }

    interface Iterating {
        next (unitFunction: UnitFunction.Iterating): Composer.Iterating;
        if (predicate: any, compositionFn: CompositionFunction.Linear): Composer.Iterating;
        elseIf (predicate: any, compositionFn: CompositionFunction.Linear): Composer.Iterating;
        else (compositionFn: CompositionFunction.Linear): Composer.Iterating;
        forEach (objectOrArray: any, compositionFn: CompositionFunction.ForEach): Composer.Iterating;
        while (predicate: any, compositionFn: CompositionFunction.Iterating): Composer.Iterating;
        doWhile (predicate: any, compositionFn: CompositionFunction.Iterating): Composer.Iterating;
    }

    interface Linear {
        next (unitFunction: UnitFunction.Linear): Composer.Linear;
        if (predicate: any, compositionFn: CompositionFunction.Linear): Composer.Linear;
        elseIf (predicate: any, compositionFn: CompositionFunction.Linear): Composer.Linear;
        else (compositionFn: CompositionFunction.Linear): Composer.Linear;
        forEach (objectOrArray: any, compositionFn: CompositionFunction.ForEach): Composer.Linear;
        while (predicate: any, compositionFn: CompositionFunction.Iterating): Composer.Linear;
        doWhile (predicate: any, compositionFn: CompositionFunction.Iterating): Composer.Linear;
    }
}

interface IVirtualFunctionCallbackParameters {
    args?: NormalMap;
    success?: (value: any) => void;
    error?: (errorDetail: string | Error) => void;
    update?: (updateDetail: any) => void;
    completed?: () => void
}

type PromiseVirtualFunction = (args: NormalMap, update?: (updateDetail: any) => void) => PromiseLike<any>;
type CallbackVirtualFunction = (params?: IVirtualFunctionCallbackParameters) => void;
type VirtualFunction = PromiseVirtualFunction | CallbackVirtualFunction;

declare namespace cq {
    function composeFunction (compositionFn: CompositionFunction.Linear, promiseConstructor?: PromiseConstructorLike): VirtualFunction;
}