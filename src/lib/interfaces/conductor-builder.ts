interface IConductorBuilder {
    build: (parentConductor?: ISequenceConductor,
    args?: NormalMap,
    success?: (value: any) => void,
    error?: (errorDetail: string | Error) => void,
    update?: (updateDetail: any) => void,
    postSuccessOrFail?: () => void) => SequenceConductorBase;

    add: (executionTarget: ExecutionTarget) => void;

    type: ConductorBuilderType;
    fnName: string;
}