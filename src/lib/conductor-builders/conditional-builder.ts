// Builder for a linear conductor that only iterates through a sequence when an associated predicate
//  resolves to true
class ConditionalSequenceConductorBuilder implements IConductorBuilder {
    constructor(predicate: any) {

        this.currentCondition = {
            predicate: predicate,
            sequence: []
        };
        this.conditions = [this.currentCondition];
        this.isClosed = false;
    }

    type: ConductorBuilderType.CONDITIONAL;
    fnName: "if()";

    currentCondition: IConditionalSequence;
    conditions: IConditionalSequence[];
    isClosed: boolean;

    add(executionTarget: ExecutionTarget): void {
        this.currentCondition.sequence.push(executionTarget);
    }

    addCondition(predicate?:any): void{
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

    build(parentConductor?: SequenceConductorBase): SequenceConductorBase {
            var self = this;
            
            //determine which sequence to use
            let sequence: ExecutionTarget[];
            utils.foreach(self.conditions, function (cond: IConditionalSequence) {
                //the sequence associated with the first predicate that resolves to true is the one to use
                if (!!utils.resolveSequencePredicate(cond.predicate, parentConductor.lets, true)) {
                    sequence = cond.sequence;
                    return false; //break
                }
            });

            // if there is no true condition sequence containing execution targets, don't return a conductor.
            //  The parent conductor will move on to the next execution target in its sequence
            if (!sequence || sequence.length === 0) {
                return null;
            }
            else {
                return new LinearSequenceConductor(sequence, parentConductor);
            }
        }
}