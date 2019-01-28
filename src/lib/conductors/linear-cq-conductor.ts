class LinearSequenceConductor extends SequenceConductorBase {
    
    constructor(executionTargets: ExecutionTarget[],
        parentConductor?: SequenceConductorBase,
        args?: NormalMap,
        success?: (value: any) => void,
        error?: (errorDetail: string | Error) => void,
        update?: (updateDetail: any) => void,
        postSuccessOrFail?: () => void) {
        super();
    
        // Build the local scope of variables for the sequence managed by this instance.
        //  if it has a parent sequence, it inherits the variables from the parent's local scope
        //  otherwise, this is the function's main sequence, and its initial variables are any arguments
        //  passed into the virtual function
        if (!!parentConductor) {
            this.lets = utils.copyLetsObject(parentConductor.lets, {});
        }
        else {
            this.lets = utils.isPrimitiveValue(args) ?
                        {} : utils.copyLetsObject(args, {});
        }
    
        // set 'private' members
        this._.parentConductor = parentConductor;
        this._.executionTargets = executionTargets;
        this._.success = success;
        this._.error = error;
        this._.update = update;
        this._.finally = postSuccessOrFail;
    
        // set the initial state of the conductor
        this._.currentExecutionTargetIndex = -1;
        this._.runCompleted = false;
    }

    start(): void {
        this.next();
    }

    _onRunComplete(ok: boolean, feedback: any): void {
        this._.runCompleted = true;

        //yield to parent sequence conductor if one exists, if not, 
        //  invoke registered callbacks
        if (!!this._.parentConductor) {
            utils.updateLetsObject(this._.parentConductor.lets, this.lets);
            this._.parentConductor.next();
        }
        else {
            if (ok && utils.isFunction(this._.success)) {
                this._.success(feedback);
            }
            else if (!ok && utils.isFunction(this._.error)) {
                this._.error(feedback);
            }
            
            if (utils.isFunction(this._.finally)) {
                this._.finally();
            }
        }
    }
}