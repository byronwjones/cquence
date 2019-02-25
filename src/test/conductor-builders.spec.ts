import {describe} from 'mocha';
import { expect } from 'chai';
import { utils } from '../lib/utils/main-utils';
import { Mocks } from './mock-repository';
import { LinearSequenceConductorBuilder } from '../lib/conductor-builders/linear-builder';
import { IConductorInterface } from '../lib/interfaces/conductor-ui';
import { ConditionalSequenceConductorBuilder } from '../lib/conductor-builders/conditional-builder';
import { WhileSequenceConductorBuilder } from '../lib/conductor-builders/while-builder';
import { ForEachSequenceConductorBuilder } from '../lib/conductor-builders/foreach-builder';

describe('Sequence Conductor Builders', () => {
    describe('Linear Sequence Conductor Builder', () => {
        describe('add', () => {
            it('should add an Execution Target to the sequence it is building', () => {
                let builder = new LinearSequenceConductorBuilder();
                let unitFn = function(ci: IConductorInterface){};

                builder.add(unitFn);

                expect(builder.sequence.length).to.equal(1, 'builder sequence should contain one execution target');
                expect(builder.sequence[0]).to.equal(unitFn, 'builder sequence should contain the unit function added');
            });
        });
        describe('build', () => {
            it('should create a new instance of LinearSequenceConductor', () => {
                let builder = new LinearSequenceConductorBuilder();
                let unitFn = function(ci: IConductorInterface){};
                builder.add(unitFn);

                let conductor = builder.build();

                expect(Mocks.isThisASequenceConductor(conductor)).to.be.true;
            });
        });
    });
    describe('Conditional Sequence Conductor Builder', () => {
        describe('add', () => {
            it('should add an Execution Target to the sequence for the condition it is currently building', () => {
                let builder = new ConditionalSequenceConductorBuilder(true);
                let unitFn = function(ci: IConductorInterface){};

                builder.add(unitFn);

                expect(builder.currentCondition.sequence.length)
                    .to.equal(1, 'builder sequence should contain one execution target');
                expect(builder.currentCondition.sequence[0])
                    .to.equal(unitFn, 'builder sequence should contain the unit function added');
            });
        });
        describe('addCondition', () => {
            it('should create a new condition and sequence to execute if that condition is true', () => {
                let builder = new ConditionalSequenceConductorBuilder(true);

                builder.addCondition(true);

                expect(builder.conditions.length).to.equal(2);
            });
            it('should make the current condition the last condition added to the set', () => {
                let builder = new ConditionalSequenceConductorBuilder(true);

                builder.addCondition(true);

                expect(builder.conditions[1]).to.equal(builder.currentCondition);
            });
            it('should make the predicate true and close the condition set when null/undefined predicate provided', () => {
                let builder = new ConditionalSequenceConductorBuilder(true);
                builder.addCondition(null);

                expect(builder.currentCondition.predicate).to.equal(true, 'predicate value should be `true`');
                expect(builder.isClosed).to.equal(true, 'isClosed should be `true`');
            });
        });
        describe('build', () => {
            it('should create a new instance of LinearSequenceConductor for the sequence of the 1st condition that resolves to true', () => {
                let builder = new ConditionalSequenceConductorBuilder(true);
                let unitFn = function(ci: IConductorInterface){};
                builder.add(unitFn);
                builder.addCondition(true);
                builder.add(unitFn);
                builder.add(unitFn);
                builder.addCondition(null);
                builder.add(unitFn);
                builder.add(unitFn);
                builder.add(unitFn);

                let conductor = builder.build(Mocks.makeLinearSequenceConductor());

                expect(Mocks.isThisASequenceConductor(conductor)).to.equal(true, 'object returned should be a sequence conductor');
                expect(conductor._.executionTargets.length).to.equal(1, 'sequence should only have one execution target');
            });
            it('should create a conductor for the sequence of the 2nd condition when it is first to resolve to true', () => {
                let builder = new ConditionalSequenceConductorBuilder(false);
                let unitFn = function(ci: IConductorInterface){};
                builder.add(unitFn);
                builder.addCondition(true);
                builder.add(unitFn);
                builder.add(unitFn);
                builder.addCondition(null);
                builder.add(unitFn);
                builder.add(unitFn);
                builder.add(unitFn);

                let conductor = builder.build(Mocks.makeLinearSequenceConductor());

                expect(conductor._.executionTargets.length).to.equal(2, 'sequence should have 2 execution targets');
            });
            it('should create a conductor for the sequence of the else condition when all prior conditions resolve to false', () => {
                let builder = new ConditionalSequenceConductorBuilder(false);
                let unitFn = function(ci: IConductorInterface){};
                builder.add(unitFn);
                builder.addCondition(false);
                builder.add(unitFn);
                builder.add(unitFn);
                builder.addCondition(null);
                builder.add(unitFn);
                builder.add(unitFn);
                builder.add(unitFn);

                let conductor = builder.build(Mocks.makeLinearSequenceConductor());

                expect(conductor._.executionTargets.length).to.equal(3, 'sequence should have 3 execution targets');
            });
            it('should return null when none of the conditions provided resolve to true', () => {
                let builder = new ConditionalSequenceConductorBuilder(false);
                let unitFn = function(ci: IConductorInterface){};
                builder.add(unitFn);
                builder.addCondition(false);
                builder.add(unitFn);

                let conductor = builder.build(Mocks.makeLinearSequenceConductor());

                expect(conductor).to.be.null;
            });
            it('should return null when the condition that resolves to true contains an empty sequence', () => {
                let builder = new ConditionalSequenceConductorBuilder(true);

                let conductor = builder.build(Mocks.makeLinearSequenceConductor());

                expect(conductor).to.be.null;
            });
        });
    });
    describe('While Sequence Conductor Builder', () => {
        describe('add', () => {
            it('should add an Execution Target to the sequence it is building', () => {
                let builder = new WhileSequenceConductorBuilder(true, false);
                let unitFn = function(ci: IConductorInterface){};

                builder.add(unitFn);

                expect(builder.sequence.length).to.equal(1, 'builder sequence should contain one execution target');
                expect(builder.sequence[0]).to.equal(unitFn, 'builder sequence should contain the unit function added');
            });
        });
        describe('build', () => {
            it('should create a new instance of WhileSequenceConductorBuilder', () => {
                let builder = new WhileSequenceConductorBuilder(true, false);
                let unitFn = function(ci: IConductorInterface){};
                builder.add(unitFn);

                let conductor = builder.build(Mocks.makeLinearSequenceConductor());
                let isWhileConductor = Mocks.isThisAnIteratingConductor(conductor) &&
                    !utils.isUndefined(conductor._.doWhile);

                expect(isWhileConductor).to.be.true;
            });
            it('should return null when the conductor sequence is empty', () => {
                let builder = new WhileSequenceConductorBuilder(true, false);

                let conductor = builder.build(Mocks.makeLinearSequenceConductor());

                expect(conductor).to.be.null;
            });
        });
    });
    describe('For Each Sequence Conductor Builder', () => {
        describe('add', () => {
            it('should add an Execution Target to the sequence it is building', () => {
                let builder = new ForEachSequenceConductorBuilder([]);
                let unitFn = function(ci: IConductorInterface){};

                builder.add(unitFn);

                expect(builder.sequence.length).to.equal(1, 'builder sequence should contain one execution target');
                expect(builder.sequence[0]).to.equal(unitFn, 'builder sequence should contain the unit function added');
            });
        });
        describe('build', () => {
            it('should create a new instance of ForEachSequenceConductorBuilder', () => {
                let builder = new ForEachSequenceConductorBuilder([]);
                let unitFn = function(ci: IConductorInterface){};
                builder.add(unitFn);

                let conductor = builder.build(Mocks.makeLinearSequenceConductor());
                let isForEachConductor = Mocks.isThisAnIteratingConductor(conductor) &&
                    !utils.isUndefined(conductor._.subjectKeyIndex);

                expect(isForEachConductor).to.be.true;
            });
            it('should return null when the conductor sequence is empty', () => {
                let builder = new ForEachSequenceConductorBuilder([]);

                let conductor = builder.build(Mocks.makeLinearSequenceConductor());

                expect(conductor).to.be.null;
            });
        });
    });
});

let SequenceConductorBuildersSpec = {};
export { SequenceConductorBuildersSpec };