import { IConductor } from "./conductor";

export interface ISequenceConductor extends IConductor {
    _onRunComplete: (ok: boolean, feedback?: any) => void;
}