interface IBlockConductor extends IConductor {
    _onRunComplete: (ok: boolean, feedback?: any) => void;
}