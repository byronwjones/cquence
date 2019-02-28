import { SequenceConductorBase } from "./cq-conductor-base";
import { utils } from "../utils/main-utils";

export abstract class IteratingSequenceConductor extends SequenceConductorBase {
    break(): void {
        if (this._.runCompleted) {
            return;
        }

        this._.runCompleted = true;
        // yield control to parent sequence conductor
        utils.updateLetsObject(this._.parentConductor.lets, this.lets);
        this._.parentConductor.next();
    }

    continue(): void {
        if (this._.runCompleted) {
            return;
        }

        // Keep in mind that a run is a complete trip through all the invocation targets in a sequence,
        //  not necessarily resulting in a yielding of control to a parent
        //  sequence conductor -- this conductor isn't necessarily giving up control,
        //  this simply means that this iteration through the sequence that this conductor is managing is complete
        this._onRunComplete(true);
    }
}