import {describe} from 'mocha';
import { expect } from 'chai';
import { utils } from '../lib/utils/main-utils';
import { Mocks } from './mock-repository';
import { IConductorInterface } from '../lib/interfaces/conductor-ui';
import { ForEachSequenceConductorBuilder } from '../lib/conductor-builders/foreach-builder';
import { WhileSequenceConductorBuilder } from '../lib/conductor-builders/while-builder';

describe('SequenceConductors', () => {
    describe('Base Sequence Conductor Functionality', () => {
        describe('next', () => {
            /*
skips an if statement that resolves to false
 */
            it('should cause the next execution target in a sequence to be invoked', (done) => {
                let sequence = [
                    function step1(ci: IConductorInterface) {
                        ci.next();
                    },
                    function step2(ci: IConductorInterface) {
                        done();
                        ci.next();
                    }
                ];
                let conductor = Mocks.makeLinearSequenceConductor(sequence);

                conductor.start();
            });
            it('should cause the success callback function provided to be called if invoked in the last unit function', (done) => {
                let sequence = [
                    function step1(ci: IConductorInterface) {
                        ci.next();
                    }
                ];
                let successCb = function(){
                    done();
                };
                let conductor = Mocks.makeLinearSequenceConductor(sequence, null, {}, successCb);

                conductor.start();
            });
            it('should pass a Linear Sequence Conductor Interface to a unit function in the main sequence', (done) => {
                let sequence = [
                    function step1(ci: IConductorInterface) {
                        expect(Mocks.isThisALinearCI(ci, true)).to.be.true;
                        done();

                        ci.next();
                    }
                ];
                let conductor = Mocks.makeLinearSequenceConductor(sequence);

                conductor.start();
            });
            it('should pass an Iterating Sequence Conductor Interface to a unit function in a while sequence', (done) => {
                let whileBuilder = new WhileSequenceConductorBuilder(true, false);
                whileBuilder.add(function step1(ci: IConductorInterface) {
                    expect(Mocks.isThisAnIteratingCI(ci, true)).to.be.true;
                    done();

                    ci.break();
                });

                let conductor = Mocks.makeLinearSequenceConductor([whileBuilder]);
                conductor.start();
            });
            it('should pass a For Each Sequence Conductor Interface to a unit function in a for each sequence', (done) => {
                let foreachBuilder = new ForEachSequenceConductorBuilder([1]);
                foreachBuilder.add(function step1(ci: IConductorInterface) {
                    expect(Mocks.isThisAForEachCI(ci)).to.be.true;
                    done();

                    ci.next();
                });
                
                let conductor = Mocks.makeLinearSequenceConductor([foreachBuilder]);
                conductor.start();
            });
        });
    });
});

let SequenceConductorsSpec = {};
export { SequenceConductorsSpec };