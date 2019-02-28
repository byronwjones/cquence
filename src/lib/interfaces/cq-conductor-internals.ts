import { InvocationTarget } from "../types/secondary-types";
import { ISequenceConductor } from "./cq-conductor";
import { IIterationProperties } from "./iteration-properties";

export interface ISequenceConductorInternals {
    runCompleted: boolean;
    currentInvocationTargetIndex: number;
    InvocationTargets: Array<InvocationTarget>;
    parentConductor: ISequenceConductor;
    iterationProperties?: IIterationProperties;
    iterationSubject?: {[key: string]: any};
    iterationSubjectKeys?: Array<string | number>;
    subjectKeyIndex?: number;
    doWhile?: boolean;
    predicate?: any;
    update?: (updateInfo: any) => void;
    success?: (returnValue: any) => void;
    error?: (errorDetails: string | Error) => void;
    finally?: () => void;
}