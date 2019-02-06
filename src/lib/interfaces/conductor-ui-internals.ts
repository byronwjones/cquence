import { ISequenceConductor } from "./cq-conductor";

export interface IConductorInterfaceInternals {
    sequenceConductor: ISequenceConductor;
    hasControl: boolean;
}