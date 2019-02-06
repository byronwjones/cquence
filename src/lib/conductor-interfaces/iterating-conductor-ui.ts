import { ConductorInterface } from "./conductor-ui";
import { ISequenceConductor } from "../interfaces/cq-conductor";
import { ucUtils } from "../utils/conductor-ui-utils";

export class IteratingConductorInterface extends ConductorInterface {
    constructor(sequenceConductor: ISequenceConductor) {
        super(sequenceConductor);
    }

    continue(): void {
        ucUtils.conductorInterfaceCommand(this, true, 'continue');
    }

    break(): void {
        ucUtils.conductorInterfaceCommand(this, true, 'break');
    }
}