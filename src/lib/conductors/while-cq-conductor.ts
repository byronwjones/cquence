import { IteratingSequenceConductor } from "./iterating-cq-conductor";
import { SequenceConductorBase } from "./cq-conductor-base";
import { InvocationTarget } from "../types/secondary-types";
import { utils } from "../utils/main-utils";

export class WhileSequenceConductor extends IteratingSequenceConductor {

    constructor(parentConductor: SequenceConductorBase,
                InvocationTargets: InvocationTarget[],
                predicate: any,
                doWhile: boolean) {
        super();
    
        //set private members
        this._ = {
            parentConductor: parentConductor,
            InvocationTargets: InvocationTargets,
            predicate: predicate,
            doWhile: doWhile,
            runCompleted: false,
            currentInvocationTargetIndex: -1
        };
    }

    start(): void {
        this._onRunComplete(true);
    }

    _onRunComplete(ok: boolean, feedback?: any): void {
        this._.currentInvocationTargetIndex = -1;
        
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