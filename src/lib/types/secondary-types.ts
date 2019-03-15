import { NormalMap } from "./primary-types";
import { ICallbackComposedFunctionParameters } from "../interfaces/callback-virtual-fn-params";
import { IConductorBuilder } from "../interfaces/conductor-builder";
import { Composer } from "../composer/composer";
import { IConductorInterface } from "../interfaces/conductor-ui";

export type UnitFunction = (unitConductor: IConductorInterface) => void;
export type CompositionFunction = (composer: Composer) => void;

export type InvocationTarget = IConductorBuilder | UnitFunction;

export type PromiseComposedFunction = (args?: NormalMap, update?: (updateDetail: any) => void) => PromiseLike<any>;
export type CallbackComposedFunction = (params?: ICallbackComposedFunctionParameters) => void;
export type ComposedFunction = PromiseComposedFunction | CallbackComposedFunction;