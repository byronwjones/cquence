import { IConductorBuilder } from "../interfaces/conductor-builder";
import { ConductorBuilderType } from "../enums/conductor-builder-type";
import { ExecutionTarget } from "../types/secondary-types";
import { SequenceConductorBase } from "../conductors/cq-conductor-base";
import { ForEachSequenceConductor } from "../conductors/foreach-cq-conductor";

// Builder for a conductor that iterates through a sequence once for each member of its associated map or array
export class ForEachSequenceConductorBuilder implements IConductorBuilder {
    constructor(predicate: any) {
        this.sequence = [];
        this.predicate = predicate;
    }

    type: ConductorBuilderType.FOREACH;
    fnName: "forEach()";

    sequence: ExecutionTarget[];
    predicate: any;

    add(executionTarget: ExecutionTarget): void {
        this.sequence.push(executionTarget);
    }

    build(parentConductor: SequenceConductorBase): SequenceConductorBase {
        // only return a conductor for a non-empty sequence array
        if (this.sequence.length > 0) {
            return new ForEachSequenceConductor(parentConductor, this.sequence, this.predicate);
        }
        else {
            return null;
        }
    }
}