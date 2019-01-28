class IteratingConductorInterface extends ConductorInterface {
    constructor(sequenceConductor: ISequenceConductor,
                iterationProperties: IIterationProperties) {
        super(sequenceConductor);
        
        // There are not always iteration properties -- these are only present for 'foreach' sequences
        if(!!iterationProperties) {
            this.$key = iterationProperties.$key;
            this.$object = iterationProperties.$object;
            this.$item = iterationProperties.$item;
        }
    }

    $key: number | string
    $object: any
    $item: any

    continue(): void {
        ucUtils.conductorInterfaceCommand(this, true, 'continue');
    }

    break(): void {
        ucUtils.conductorInterfaceCommand(this, true, 'break');
    }
}