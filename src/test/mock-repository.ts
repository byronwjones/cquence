import { IConductorInterface } from "../lib/interfaces/conductor-ui";
import { LinearSequenceConductor } from "../lib/conductors/linear-cq-conductor";
import { ExecutionTarget } from "../lib/types/secondary-types";
import { SequenceConductorBase } from "../lib/conductors/cq-conductor-base";
import { NormalMap } from "../lib/types/primary-types";
import { ConductorInterface } from "../lib/conductor-interfaces/conductor-ui";
import { ISequenceConductor } from "../lib/interfaces/cq-conductor";
import { utils } from "../lib/utils/main-utils";

let Mocks = (function(){
    class MockRepository {
        get simpleSequence() {
            return [
                function(ui: IConductorInterface){
                    ui.lets.a = 'foo';
                    ui.next();
                },
                function(ui: IConductorInterface){
                    ui.lets.b = 'bar';
                    ui.next();
                },
                function(ui: IConductorInterface){
                    ui.lets.c = 'baz';
                    ui.return(`${ui.lets.a} ${ui.lets.b} ${ui.lets.c}`);
                }
            ];
        }

        makeLinearSequenceConductor(executionTargets?: ExecutionTarget[],
            parentConductor: SequenceConductorBase = null,
            args: NormalMap = {},
            success?: (value?: any) => void,
            error?: (errorDetail: string | Error) => void,
            update?: (updateDetail: any) => void,
            postSuccessOrFail?: () => void): LinearSequenceConductor {
                executionTargets = executionTargets || this.simpleSequence;

                return new LinearSequenceConductor(executionTargets,
                    parentConductor,
                    args,
                    success,
                    error,
                    update,
                    postSuccessOrFail
                );
        }

        makeConductorInterface(success?: (value?: any) => void,
            error?: (errorDetail: string | Error) => void): ConductorInterface;
        makeConductorInterface(conductor: ISequenceConductor): ConductorInterface;
        makeConductorInterface(conductorOrSuccessFn: any,
            error?: (errorDetail: string | Error) => void): ConductorInterface {

            let conductor: ISequenceConductor, success: (value?: any) => void;
            if(!utils.isNullOrUndefined(conductorOrSuccessFn) &&
                !utils.isFunction(conductorOrSuccessFn)) {
                conductor = conductorOrSuccessFn;
            }
            else {
                success = conductorOrSuccessFn;
            }

            conductor = conductor ||
                this.makeLinearSequenceConductor(this.simpleSequence, null, {}, success, error);
            
            return new ConductorInterface(conductor);
        }

        isThisASequenceConductor(obj: any): boolean {
            return !utils.isNullOrUndefined(obj) &&
                   !utils.isNullOrUndefined(obj._) &&
                    utils.isFunction(obj.start) &&
                    utils.isFunction(obj._onRunComplete) &&
                    utils.isFunction(obj.next) &&
                    utils.isFunction(obj.error) &&
                    utils.isFunction(obj.return) &&
                    utils.isFunction(obj.update);
        }
    };

    return new MockRepository();
})();

export { Mocks };