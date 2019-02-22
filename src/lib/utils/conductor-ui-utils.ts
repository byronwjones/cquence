import { IConductor } from "../interfaces/conductor";
import { IConductorInterfaceInternals } from "../interfaces/conductor-ui-internals";
import { privado } from "../types/primary-types";

let ucUtils = (function(){
    class ConductorInterfaceUtils {
        getInterfaceInternals (conductorUI: IConductor): IConductorInterfaceInternals {
            return conductorUI[privado] as IConductorInterfaceInternals;
        }

        conductorInterfaceCommand (conductorUI:IConductor,
                                yieldControl:boolean,
                                command:string,
                                arg?: any) {
            //make sure its okay for this conductor interface to call the given command on the underlying sequence conductor 
            // (i.e. this conductor interface has not yet abdicated control)
            this.validateCommandUsage(conductorUI, command);
            if (yieldControl) {
                this.yieldControl(conductorUI);
            } 

            // call the underlying sequence conductor command
            let itnal = this.getInterfaceInternals(conductorUI);
            itnal.sequenceConductor[command](arg);
        }

        validateCommandUsage (conductorUI: IConductor, cmd: string): void {
            let itnal = this.getInterfaceInternals(conductorUI);
            if (itnal.hasControl) { return; } //OK to proceed with given command
    
            let msg = 'Illegal call to function ' + cmd +
                    '(): this interface has already yielded control to the next execution target; no further calls are allowed to be made from this interface.';
            //stop the sequence conductor from continuing to run
            itnal.sequenceConductor.error(msg);
            throw new Error(msg);
        }
    
        yieldControl(conductorUI: IConductor): void {
            let itnal = this.getInterfaceInternals(conductorUI);
            itnal.hasControl = false;
            // prevent further changes to own properties of the lets object from this interface by removing its reference to it
            conductorUI.lets = null; 
        }
    }

    return new ConductorInterfaceUtils();
})();

export {ucUtils};