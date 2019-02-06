import { ExecutionTarget } from "../types/secondary-types";

export interface IConditionalSequence {
    sequence: Array<ExecutionTarget>;
    predicate: any;
}