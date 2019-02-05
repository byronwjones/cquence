class ConductorInterface implements IConductorInterface {
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