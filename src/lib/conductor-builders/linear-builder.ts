import { IConductorBuilder } from "../interfaces/conductor-builder";
import { ConductorBuilderType } from "../enums/conductor-builder-type";
import { ExecutionTarget } from "../types/secondary-types";
import { SequenceConductorBase } from "../conductors/cq-conductor-base";
import { NormalMap } from "../types/primary-types";
import { LinearSequenceConductor } from "../conductors/linear-cq-conductor";

// Sequence conductor builders are are a type of 'execution target', so like a unit function, they are
//   included in the array (sequence) of execution targets that a sequence conductor iterates through at runtime.
// They are effectively factories that produce sequence conductors when called upon to do so by a parent conductor. 
//   This allows the newly created sequence conductor to run in context, and, as in the case of conductor builders
//   for conditional sequences, allows cquence to decide at runtime whether or not a conductor's sequence should run at all.
//   This architecture also allows cquence to safely run the same virtual function multiple times concurrently.
    
// Builder for a basic conductor that iterates through a sequence only once
export class LinearSequenceConductorBuilder implements IConductorBuilder {
        type: ConductorBuilderType.LINEAR;
        fnName: "composeFunction()";
        sequence: ExecutionTarget[];

        add(executionTarget: ExecutionTarget): void {
            this.sequence.push(executionTarget);
        }

        build(parentConductor?: SequenceConductorBase,
            args?: NormalMap,
            success?: (value: any) => void,
            error?: (errorDetail: string | Error) => void,
            update?: (updateDetail: any) => void,
            postSuccessOrFail?: () => void): SequenceConductorBase {
                return new LinearSequenceConductor(this.sequence, parentConductor,
                            args, success, error, update, postSuccessOrFail);
            }
    }