import { IConductorInterface } from "../interfaces/conductor-ui";
import { privado, NormalMap } from "../types/primary-types";
import { ucUtils } from "../utils/conductor-ui-utils";
import { ISequenceConductor } from "../interfaces/cq-conductor";

// Conductor interfaces are passed into unit functions, providing an API that temporarily exposes the methods
//  on a sequence conductor, and provides access to the lets object - scoped variables local to the composed function.
// The conductor interface ensures that unit functions can only cause the sequence conductor to move on to the
//  next unit once -- after the unit function abdicates control, subsequent calls to the conductor interface's API
//  will throw an error

export class ConductorInterface implements IConductorInterface {
    constructor(cqConductor: ISequenceConductor) {
        this.lets = cqConductor.lets;
    
        this[privado] = {
            sequenceConductor: cqConductor,
            hasControl: true
        };
    }

    [key: string]: any

    lets: NormalMap

    next(): void {
        ucUtils.conductorInterfaceCommand(this, true, 'next');
    } 

    return(returnValue?: any): void {
        ucUtils.conductorInterfaceCommand(this, true, 'return', returnValue);
    }

    error(errorMessage?: string | Error): void {
        ucUtils.conductorInterfaceCommand(this, true, 'error', errorMessage);
    }

    update(updateInfo?: any): void {
        ucUtils.conductorInterfaceCommand(this, false, 'update', updateInfo);
    }
}