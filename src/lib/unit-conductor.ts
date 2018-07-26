// Unit conductors are passed into unit functions, providing an API that temporarily exposes the methods
//  on a code block conductor, and provides access to the lets object - variables local to the virtual function.
// The unit conductor ensures that unit functions can only cause the code block conductor to move on to the
//  next unit one time -- after the unit function abdicates control, subsequent calls to the unit conductor's API
//  won't work, and will throw an error

class UnitConductor implements IUnitConductor {
    constructor(blockConductor: IBlockConductor, unitFn: UnitFunction) {
        this.lets = blockConductor.lets;
    
        this[privado] = {
            blockDriver: blockConductor,
            hasControl: true
        };
    
        //begin immediately
        unitFn(this);
    }

    [key: string]: any

    lets: NormalMap

    next(): void {
        ucUtils.unitConductorCommand(this, true, 'next');
    } 

    return(returnValue?: any): void {
        ucUtils.unitConductorCommand(this, true, 'return', returnValue);
    }

    error(errorMessage?: string | Error): void {
        ucUtils.unitConductorCommand(this, true, 'error', errorMessage);
    }

    update(updateInfo?: any): void {
        ucUtils.unitConductorCommand(this, false, 'update', updateInfo);
    }
}