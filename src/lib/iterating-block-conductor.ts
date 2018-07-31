abstract class IteratingBlockConductor extends BlockConductorBase {
    break(): void {
        if (this._.runCompleted) {
            return;
        }

        this._.runCompleted = true;
        // yield control to parent block conductor
        utils.updateLetsObject(this._.parentConductor, this.lets);
        this._.parentConductor.next();
    }

    continue(): void {
        if (this._.runCompleted) {
            return;
        }

        // Keep in mind that a run is a complete trip through all blocks in a blockset,
        //  not necessarily resulting in a yielding of control to a parent
        //  block conductor -- this conductor isn't necessarily giving up control,
        //  this simply means that this iteration through the block is complete
        this._onRunComplete(true);
    }
}