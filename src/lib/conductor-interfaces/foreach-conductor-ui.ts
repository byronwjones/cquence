import { IIterationProperties } from "../interfaces/iteration-properties";
import { IteratingConductorInterface } from "./iterating-conductor-ui"
import { ISequenceConductor } from "../interfaces/cq-conductor";

export class ForEachConductorInterface extends IteratingConductorInterface {
    constructor(sequenceConductor: ISequenceConductor,
                iterationProperties: IIterationProperties) {
        super(sequenceConductor);
        
        this.$key = iterationProperties.$key;
        this.$object = iterationProperties.$object;
        this.$item = iterationProperties.$item;
    }

    $key: number | string;
    $object: any;
    $item: any;
}