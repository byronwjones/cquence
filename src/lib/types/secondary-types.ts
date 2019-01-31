type UnitFunction = (unitConductor: IConductorInterface) => void;
type CompositionFunction = (composer: Composer) => void;

type ExecutionTarget = IConductorBuilder | UnitFunction;

type PromiseVirtualFunction = (args: NormalMap, update?: (updateDetail: any) => void) => PromiseLike<any>;
type CallbackVirtualFunction = (params?: ICallbackVirtualFunctionParameters) => void;
type VirtualFunction = PromiseVirtualFunction | CallbackVirtualFunction;