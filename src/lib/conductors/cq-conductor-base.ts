import { ISequenceConductor } from "../interfaces/cq-conductor";
import { ISequenceConductorInternals } from "../interfaces/cq-conductor-internals";
import { NormalMap } from "../types/primary-types";
import { utils } from "../utils/main-utils";
import { UnitFunction } from "../types/secondary-types";
import { IConductorBuilder } from "../interfaces/conductor-builder";
import { ConductorInterface } from "../conductor-interfaces/conductor-ui"
import { IteratingConductorInterface } from "../conductor-interfaces/iterating-conductor-ui"
import { ForEachConductorInterface } from "../conductor-interfaces/foreach-conductor-ui";

//Sequence conductors manage the flow of the virtual function. It contains an array (sequence) of execution targets,
//  coordinating which execution target to call,
//  and when to yield control of the virtual function flow to a parent sequence conductor

export abstract class SequenceConductorBase implements ISequenceConductor {
    protected _: ISequenceConductorInternals

    abstract _onRunComplete(ok: boolean, feedback?: any): void

    abstract start(): void

    lets: NormalMap

    // Determines if there is another unit function or child sequence (aka 'execution target'), to call
    //  within the sequence that this conductor manages.  If there is, it will either create
    //  the appropriate conductor interface for interaction with this conductor, passing it into and invoking a unit function,
    //  or it will create a child sequence conductor that will execute the child sequence.
    //  If there are no more execution targets, this sequence conductor will
    //  yield runtime control to its parent sequence conductor (if it has one), or end the virtual function.
    next(): void {
        // do nothing if this sequence conductor is already done working
        if (this._.runCompleted) {
            return;
        } 

        this._.currentExecutionTargetIndex++;
        // perform the next task if possible
        if (this._.currentExecutionTargetIndex < this._.executionTargets.length) {
            let exeTarget = this._.executionTargets[this._.currentExecutionTargetIndex];

            try {
                // execution target is a unit function
                if (utils.isFunction(exeTarget)) {
                    // create the correct type of conductor interface
                    let fn = exeTarget as UnitFunction;
                    let uc: ConductorInterface;
                    if (utils.isAnIteratingSequenceConductor(this)) {
                        if(!!this._.iterationProperties &&
                            !!this._.iterationProperties.$object) {
                            uc = new ForEachConductorInterface(this, this._.iterationProperties);
                        }
                        else {
                            uc = new IteratingConductorInterface(this);
                        }
                    }
                    else {
                        uc = new ConductorInterface(this);
                    }

                    // execute unit function
                    fn(uc);
                }
                // execution target is a child sequence --
                //  use the conductor builder to create a sequence conductor
                else {
                    let bc = (<IConductorBuilder>exeTarget).build(this);
                    // pass control to the created sequence conductor.
                    // Note that if the conductor builder decided not to create a conductor
                    //  (which is something that happens when none of the conditions in a conditional builder resolve to true)
                    //  it will return a null conductor. When this happens, we just move on to the next execution target
                    //  in the sequence.
                    if(!!bc){
                        bc.start();
                    }
                    else {
                        this.next();
                    }
                }
            }
            catch (err) {
                this.error(err);
            }
        }
        else { //if sequence completed, handle as a successful run
            this._onRunComplete(true);
        }
    }

    error(exception?: string | Error): void {
        if (this._.runCompleted) {
            return;
        }

        // if this has a parent sequence conductor, call error on it
        if (!!this._.parentConductor) {
            this._.runCompleted = true;
            this._.parentConductor.error(exception);
        }
        // if no parent (this is the conductor for main sequence of the virtual function),
        //   call failure callback/reject Promise
        else { 
            this._onRunComplete(false, exception);
        }
    }

    return(returnValue: any): void {
        if (this._.runCompleted) {
            return;
        }

        // If this sequence conductor has a parent, call return on it,
        //  otherwise this is the conductor for the virtual function's main sequence
        //  in which case call the success callback/fulfill the Promise
        if (!!this._.parentConductor) {
            this._.runCompleted = true;
            this._.parentConductor.return(returnValue);
        }
        else {
            this._onRunComplete(true, returnValue);
        }
    }

    update(updateInfo: any): void {
        if (this._.runCompleted) {
            return;
        }

        // call update up the hierarchy to the main sequence conductor,
        //  when that is reached, the actual update callback will be invoked
        if (!!this._.parentConductor) {
            this._.parentConductor.update(updateInfo);
        }
        else if (utils.isFunction(this._.update)) {
            this._.update(updateInfo);
        }
    }
}