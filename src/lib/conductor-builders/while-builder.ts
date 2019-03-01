import { IConductorBuilder } from "../interfaces/conductor-builder";
import { ConductorBuilderType } from "../enums/conductor-builder-type";
import { InvocationTarget } from "../types/secondary-types";
import { SequenceConductorBase } from "../conductors/cq-conductor-base";
import { WhileSequenceConductor } from "../conductors/while-cq-conductor";

// Builder for a conductor that iterates through a sequence as long as its associated predicate resolves to true
export class WhileSequenceConductorBuilder implements IConductorBuilder {
    constructor(predicate: any, doWhile: boolean) {
        this.sequence = [];
        this.predicate = predicate;
        this.doWhile = doWhile;
        this.fnName = doWhile ? "doWhile()" : "while()";
    }

    type: ConductorBuilderType = ConductorBuilderType.WHILE;
    fnName: string;

    sequence: InvocationTarget[];
    predicate: any;
    doWhile: boolean;

    add(InvocationTarget: InvocationTarget): void {
        this.sequence.push(InvocationTarget);
    }

    build(parentConductor: SequenceConductorBase): SequenceConductorBase {
        // only return a conductor for a non-empty sequence array
        if (this.sequence.length > 0) {
            return new WhileSequenceConductor(parentConductor, this.sequence, this.predicate, this.doWhile);
        }
        else {
            return null;
        }
    }
}