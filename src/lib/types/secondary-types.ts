import { NormalMap } from "./primary-types";
import { ICallbackVirtualFunctionParameters } from "../interfaces/callback-virtual-fn-params";
import { IConductorBuilder } from "../interfaces/conductor-builder";
import { Composer } from "../composer/composer";
import { IConductorInterface } from "../interfaces/conductor-ui";

export type UnitFunction = (unitConductor: IConductorInterface) => void;
export type CompositionFunction = (composer: Composer) => void;

export type InvocationTarget = IConductorBuilder | UnitFunction;

export type PromiseVirtualFunction = (args: NormalMap, update?: (updateDetail: any) => void) => PromiseLike<any>;
export type CallbackVirtualFunction = (params?: ICallbackVirtualFunctionParameters) => void;
export type VirtualFunction = PromiseVirtualFunction | CallbackVirtualFunction;