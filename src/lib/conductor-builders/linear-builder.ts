// Builder for a basic conductor that iterates through a sequence only once
    class LinearSequenceConductorBuilder implements IConductorBuilder {
        type: ConductorBuilderType.LINEAR;
        fnName: "composeFunction()";
        sequence: ExecutionTarget[];

        add(executionTarget: ExecutionTarget): void {
            this.sequence.push(executionTarget);
        }

        build(parentConductor?: SequenceConductorBase,
            args?: NormalMap,
            success?: (value: any) => void,
            error?: (errorDetail: string | Error) => void,
            update?: (updateDetail: any) => void,
            postSuccessOrFail?: () => void): SequenceConductorBase {
                return new LinearSequenceConductor(this.sequence, parentConductor,
                            args, success, error, update, postSuccessOrFail);
            }
    }