class WhileSequenceConductor extends IteratingSequenceConductor {

    constructor(parentConductor: SequenceConductorBase,
                executionTargets: ExecutionTarget[],
                predicate: any,
                doWhile: boolean) {
        super();
    
        //set private members
        this._.parentConductor = parentConductor;
        this._.executionTargets = executionTargets;
        this._.predicate = predicate;
        this._.doWhile = doWhile;
        this._.runCompleted = false;
    }

    start(): void {
        this._onRunComplete(true);
    }

    _onRunComplete(ok: boolean, feedback?: any): void {
        this._.currentExecutionTargetIndex = -1;
        
        // the if statement is necessary because the lets object is null the first
        //  time this function is called.
        if(!!this.lets) {
            utils.updateLetsObject(this._.parentConductor.lets, this.lets);
        }

        // if this is the first in a do/while iteration, or if the while predicate evaluates true,
        //  iterate through the sequence again.  Otherwise pass control back to the parent conductor
        if (this._.doWhile ||
            !!utils.resolveSequencePredicate(this._.predicate, this._.parentConductor.lets, true)) {
            
            this._.doWhile = false;
            // recreate the lets object from a copy of the parent on every iteration.
            //  In this way we remove any variables added to the object during the previous
            //  iteration
            this.lets = utils.copyLetsObject(this._.parentConductor.lets, {});
            // kick off this iteration
            this.next();
        }
        else { // pass control back to the parent conductor
            this._.runCompleted = true;
            this._.parentConductor.next();
        }
    }
}