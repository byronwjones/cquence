interface IBlockConductorInternals {
    runCompleted: boolean;
    currentExecutionTargetIndex: number;
    executionTargets: Array<ExecutionTarget>;
    parentConductor: IBlockConductor;
    iterationProperties?: IIterationProperties;
    doWhile?: boolean;
    predicate?: any;
    update?: (updateInfo: any) => void;
    success?: (returnValue: any) => void;
    error?: (errorDetails: string | Error) => void;
    finally?: () => void;
}