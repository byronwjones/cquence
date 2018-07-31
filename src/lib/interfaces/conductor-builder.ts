interface IConductorBuilder {
    build: (conductor: IBlockConductor) => BlockConductorBase;
}