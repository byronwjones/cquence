class IteratingUnitConductor extends UnitConductor {
    constructor(blockConductor: IBlockConductor,
                iterationProperties: IIterationProperties) {
        super(blockConductor);
        
        this.$key = iterationProperties.$key;
        this.$object = iterationProperties.$object;
        this.$item = iterationProperties.$item;
    }

    $key: number | string
    $object: any
    $item: any

    continue(): void {
        ucUtils.unitConductorCommand(this, true, 'continue');
    }

    break(): void {
        ucUtils.unitConductorCommand(this, true, 'break');
    }
}