interface IBlockConductorInternals {
    runCompleted: boolean;
    currentExecutionTargetIndex: number;
    executionTargets: Array<UnitFunction | IConductorBuilder>;
    parentConductor: IBlockConductor;
    iterationProperties?: IIterationProperties;
    update?: (updateInfo: any) => void;
}