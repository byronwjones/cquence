import { NormalMap } from "../types/primary-types";
import { ExecutionTarget } from "../types/secondary-types";
import { IConditionalSequence } from "./conditional-cq";
import { ConductorBuilderType } from "../enums/conductor-builder-type";
import { ISequenceConductor } from "./cq-conductor";
import { SequenceConductorBase } from "../conductors/cq-conductor-base";

export interface IConductorBuilder {
    build: (parentConductor?: ISequenceConductor,
    args?: NormalMap,
    success?: (value: any) => void,
    error?: (errorDetail: string | Error) => void,
    update?: (updateDetail: any) => void,
    postSuccessOrFail?: () => void) => SequenceConductorBase;

    add: (executionTarget: ExecutionTarget) => void;

    type: ConductorBuilderType;
    fnName: string;
    sequence?: ExecutionTarget[];
    currentCondition?: IConditionalSequence;
}