// Builder for a conductor that iterates through a sequence as long as its associated predicate resolves to true
class WhileSequenceConductorBuilder implements IConductorBuilder {
    constructor(predicate: any, doWhile: boolean) {
        this.sequence = [];
        this.predicate = predicate;
        this.doWhile = doWhile;
        this.fnName = doWhile ? "doWhile()" : "while()";
    }

    type: ConductorBuilderType.WHILE;
    fnName: string;

    sequence: ExecutionTarget[];
    predicate: any;
    doWhile: boolean;

    add(executionTarget: ExecutionTarget): void {
        this.sequence.push(executionTarget);
    }

    build(parentConductor: SequenceConductorBase): SequenceConductorBase {
        // only return a conductor for a non-empty sequence array
        if (this.sequence.length > 0) {
            return new WhileSequenceConductor(parentConductor, this.sequence, this.predicate, this.doWhile);
        }
        else {
            return null;
        }
    }
}