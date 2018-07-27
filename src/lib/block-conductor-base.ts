//Code block conductors manage the flow of the virtual function. It contains an array of unit functions,
//  and it coordinates which unit function in its array to call,
//  and when to yield control of the virtual function flow to a parent block conductor

abstract class BlockConductorBase implements IBlockConductor {
    _: IBlockConductorInternals

    abstract _onRunComplete(ok: boolean, feedback?: any): void

    lets: NormalMap

    // Determines if there is another unit function, or child 'code block', to call within the 'code block'
    //  that this block conductor manages.  If there is, it will either create the appropriate unit
    //  conductor the unit function will use to interface with this object and execute the unit function,
    //  or it will create a block conductor that will execute the child 'code block'.
    //  If there are no more unit functions/child 'code blocks' to execute, this block conductor will
    //  yield runtime control to its parent block conductor (if it has one), or end the virtual function.
    next(): void {
        // do nothing if this block conductor is already done working
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
                    // create the correct type of unit conductor
                    let fn = exeTarget as UnitFunction;
                    if (utils.isAnIteratingBlockConductor(this)) {
                        new IteratingUnitConductor(this, fn, this._.iterationProperties);
                    }
                    else {
                        new UnitConductor(this, fn);
                    }
                }
                // execution target is a child 'code block' --
                //  use the conductor builder to create a block constructor,
                //  passing control of the virtual function to it
                else {
                    (<IConductorBuilder>exeTarget).build(this);
                }
            }
            catch (err) {
                this.error(err);
            }
        }
        else { //if block completed, handle as a successful run
            this._onRunComplete(true);
        }
    }

    error(exception?: string | Error): void {
        if (this._.runCompleted) {
            return;
        }

        // if this has a parent block conductor, call error on it
        if (!!this._.parentConductor) {
            this._.runCompleted = true;
            this._.parentConductor.error(exception);
        }
        // if no parent (this is the conductor for the body of the virtual function),
        //   call failure callback/reject Promise
        else { 
            this._onRunComplete(false, exception);
        }
    }

    return(returnValue: any): void {
        if (this._.runCompleted) {
            return;
        }

        // If this block conductor has a parent, call return on it,
        //  otherwise this is the conductor for the virtual function's main block
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

        // call update up the hierarchy to the main block conductor,
        //  when that is reached, the actual update callback will be invoked
        if (!!this._.parentConductor) {
            this._.parentConductor.update(updateInfo);
        }
        else if (utils.isFunction(this._.update)) {
            this._.update(updateInfo);
        }
    }
}