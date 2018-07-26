/// <reference path="utils.ts" />

let ucUtils = (function(){
    class UnitConductorUtils {
        getConductorInternals (conductor: IConductor): IUnitConductorInternals {
            return conductor[privado] as IUnitConductorInternals;
        }

        unitConductorCommand (conductor:IConductor,
                                yieldControl:boolean,
                                command:string,
                                arg?: any) {
            //make sure its okay for this unit conductor to call the given command on the underlying block conductor 
            // (i.e. this unit conductor has not been abdicated control)
            conductor.validateCommandUsage(command);
            if (yieldControl) {
                conductor.yieldControl();
            } 

            // call the underlying block conductor command
            let itnal = this.getConductorInternals(conductor);
            itnal.blockConductor[command](arg);
        }

        validateCommandUsage (conductor: IConductor, cmd: string): void {
            let itnal = this.getConductorInternals(conductor);
            if (itnal.hasControl) { return; } //OK to proceed with given command
    
            let msg = 'Illegal call to function ' + cmd +
                    '(): this unit conductor has already yielded control to the next unit; no further calls are allowed to be made from this conductor.';
            //stop the block conductor from continuing to run
            itnal.blockConductor.error(msg);
            throw new Error(msg);
        }
    
        yieldControl(conductor: IConductor): void {
            let itnal = this.getConductorInternals(conductor);
            itnal.hasControl = false;
            // prevent further changes to the lets object by removing its reference to it
            conductor.lets = null; 
        }
    }

    return new UnitConductorUtils();
})();