import { IteratingSequenceConductor } from "./iterating-cq-conductor";
import { SequenceConductorBase } from "./cq-conductor-base";
import { ExecutionTarget } from "../types/secondary-types";
import { utils } from "../utils/main-utils";

export class ForEachSequenceConductor extends IteratingSequenceConductor {
    
    constructor(parentConductor: SequenceConductorBase,
                executionTargets: ExecutionTarget[],
                predicate: any) {
        super();
    
        this._ = {
            parentConductor: parentConductor,
            executionTargets: executionTargets,
            predicate: predicate,
            runCompleted: false,
            subjectKeyIndex: -1,
            iterationSubject: null,
            iterationSubjectKeys: null,
            currentExecutionTargetIndex: -1
        };
    
        this._.iterationSubject =
            utils.resolveSequencePredicate(predicate, parentConductor.lets, false);
        
        // get the keys (indices or object properties) this conductor will iterate over
        if (utils.isArray(this._.iterationSubject)) {
            this._.iterationSubjectKeys = []; //for arrays keys are numbers

            let itSub = this._.iterationSubject as Array<any>;
            for (let i = 0, ln = itSub.length; i < ln; i++) {
                this._.iterationSubjectKeys[i] = i;
            }
        }
        else {
            this._.iterationSubjectKeys = utils.getKeys(this._.iterationSubject);
        }
    }

    start(): void {
        this._onRunComplete(true);
    }

    _onRunComplete(ok: boolean, feedback?: any): void {
        // index indicating which object key or array member to iterate
        //   on for this run
        this._.subjectKeyIndex++;

        // reset to start iterating from the first execution target in the sequence
        this._.currentExecutionTargetIndex = -1;

        if (!!this.lets) {
            utils.updateLetsObject(this._.parentConductor.lets, this.lets);
        }

        // if there is another array/object member to iterate on, do so,
        //  otherwise return control to the parent conductor
        if (this._.subjectKeyIndex < this._.iterationSubjectKeys.length) {

            let key = this._.iterationSubjectKeys[this._.subjectKeyIndex];
            this._.iterationProperties = {
                $key: key,
                $object: this._.iterationSubject,
                $item: this._.iterationSubject[key]
            };

            this.lets = utils.copyLetsObject(this._.parentConductor.lets, {});
            this.next();
        }
        else {
            // return control to parent sequence conductor
            this._.runCompleted = true;
            this._.parentConductor.next();
        }
    }
}