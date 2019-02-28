import { InvocationTarget } from "../types/secondary-types";

export interface IConditionalSequence {
    sequence: Array<InvocationTarget>;
    predicate: any;
}