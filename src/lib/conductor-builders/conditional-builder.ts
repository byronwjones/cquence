import { IConductorBuilder } from "../interfaces/conductor-builder";
import { ConductorBuilderType } from "../enums/conductor-builder-type";
import { IConditionalSequence } from "../interfaces/conditional-cq";
import { InvocationTarget } from "../types/secondary-types";
import { utils } from "../utils/main-utils";
import { SequenceConductorBase } from "../conductors/cq-conductor-base";
import { LinearSequenceConductor } from "../conductors/linear-cq-conductor";

// Builder for a linear conductor that only iterates through a sequence when an associated predicate
//  resolves to true
export class ConditionalSequenceConductorBuilder implements IConductorBuilder {
    constructor(predicate: any) {

        this.fnName = "if()";
        this.currentCondition = {
            predicate: predicate,
            sequence: []
        };
        this.conditions = [this.currentCondition];
        this.isClosed = false;
    }

    type: ConductorBuilderType = ConductorBuilderType.CONDITIONAL;
    fnName: string;

    currentCondition: IConditionalSequence;
    conditions: IConditionalSequence[];
    isClosed: boolean;

    add(InvocationTarget: InvocationTarget): void {
        this.currentCondition.sequence.push(InvocationTarget);
    }

    addCondition(predicate?:any): void{
        //do not add any more conditions if the condition set is closed
        if(this.isClosed) {
            return;
        }
        
        //null or undefined predicate always indicates an else statement
        if (utils.isNullOrUndefined(predicate)) {
            predicate = true; //because else is always a true condition
            this.isClosed = true; //no more else if conditions allowed 
        }

        this.currentCondition = {
            predicate: predicate,
            sequence: []
        };
        this.conditions.push(this.currentCondition);
    }

    build(parentConductor: SequenceConductorBase): SequenceConductorBase {
            var self = this;
            
            //determine which sequence to use
            let sequence: InvocationTarget[];
            utils.foreach(self.conditions, function (cond: IConditionalSequence) {
                //the sequence associated with the first predicate that resolves to true is the one to use
                if (!!utils.resolveSequencePredicate(cond.predicate, parentConductor.lets, true)) {
                    sequence = cond.sequence;
                    return false; //break
                }
            });

            // if there is no true condition sequence containing invocation targets, don't return a conductor.
            //  The parent conductor will move on to the next invocation target in its sequence
            if (!sequence || sequence.length === 0) {
                return null;
            }
            else {
                return new LinearSequenceConductor(sequence, parentConductor);
            }
        }
}