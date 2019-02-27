import {describe} from 'mocha';
import { expect } from 'chai';
import { utils } from '../lib/utils/main-utils';
import { Mocks } from './mock-repository';
import { IConductorInterface } from '../lib/interfaces/conductor-ui';
import { ForEachSequenceConductorBuilder } from '../lib/conductor-builders/foreach-builder';
import { WhileSequenceConductorBuilder } from '../lib/conductor-builders/while-builder';
import { ConditionalSequenceConductorBuilder } from '../lib/conductor-builders/conditional-builder';

describe('SequenceConductors', () => {
    describe('Common Sequence Conductor Functions', () => {
        describe('next', () => {
            it('should cause the next execution target in a sequence to be invoked', (done) => {
                let sequence = [
                    function step1(ci: IConductorInterface) { },
                    function step2(ci: IConductorInterface) {
                        done();
                    }
                ];
                let conductor = Mocks.makeLinearSequenceConductor(sequence);

                conductor.next();
                conductor.next();
            });
            it('should cause the success callback function provided to be called if invoked in the last unit function', (done) => {
                let sequence = [
                    function step1(ci: IConductorInterface) { }
                ];
                let successCb = function(){
                    done();
                };
                let conductor = Mocks.makeLinearSequenceConductor(sequence, null, {}, successCb);

                conductor.next();
                conductor.next();
            });
            it('should pass a Linear Sequence Conductor Interface to a unit function in the main sequence', (done) => {
                let sequence = [
                    function step1(ci: IConductorInterface) {
                        expect(Mocks.isThisALinearCI(ci, true)).to.be.true;
                        done();
                    }
                ];
                let conductor = Mocks.makeLinearSequenceConductor(sequence);

                conductor.next();
            });
            it('should pass an Iterating Sequence Conductor Interface to a unit function in a while sequence', (done) => {
                let whileBuilder = new WhileSequenceConductorBuilder(true, false);
                whileBuilder.add(function step1(ci: IConductorInterface) {
                    expect(Mocks.isThisAnIteratingCI(ci, true)).to.be.true;
                    done();
                });

                let conductor = Mocks.makeLinearSequenceConductor([whileBuilder]);

                conductor.next();
            });
            it('should pass a For Each Sequence Conductor Interface to a unit function in a for each sequence', (done) => {
                let foreachBuilder = new ForEachSequenceConductorBuilder([1]);
                foreachBuilder.add(function step1(ci: IConductorInterface) {
                    expect(Mocks.isThisAForEachCI(ci)).to.be.true;
                    done();
                });
                
                let conductor = Mocks.makeLinearSequenceConductor([foreachBuilder]);

                conductor.next();
            });
            it('should skip an if statement\'s sequence when its predicate resolves to false', (done) => {
                let ifBuilder = new ConditionalSequenceConductorBuilder(false);
                ifBuilder.add(function step1(ci: IConductorInterface) {
                    expect.fail('Sequence of an if statement with a predicate that resolves to false should not execute')
                });

                let sequence = [
                    function step1(ci: IConductorInterface) { },
                    ifBuilder,
                    function step3(ci: IConductorInterface) {
                        done();
                    }
                ];
                let conductor = Mocks.makeLinearSequenceConductor(sequence);

                conductor.next();
                conductor.next(); // next skips step two, starts step three
            });
        });
        describe('return', () => {
            it('should cause the success callback function provided to be called if invoked', (done) => {
                let successCb = function(result: any){
                    expect(result).to.equal('Successful');
                    done();
                };
                let conductor = Mocks.makeLinearSequenceConductor([], null, {}, successCb);

                conductor.return('Successful');
            });
            it('should invoke the success function on a parent sequence when invoked on a child sequence', (done) => {
                let successCb = function(result: any){
                    expect(result).to.equal('Successful');
                    done();
                };
                let parentConductor = Mocks.makeLinearSequenceConductor([], null, {}, successCb);
                let childConductor = Mocks.makeLinearSequenceConductor([], parentConductor);

                childConductor.return('Successful');
            });
        });
        describe('error', () => {
            it('should cause the error callback function provided to be called if invoked', (done) => {
                let errorCb = function(message: string){
                    expect(message).to.equal('Error occurred');
                    done();
                };
                let conductor = Mocks.makeLinearSequenceConductor([], null, {}, null, errorCb);

                conductor.error('Error occurred');
            });
            it('should invoke the error function on a parent sequence when invoked on a child sequence', (done) => {
                let errorCb = function(message: string){
                    expect(message).to.equal('Error occurred');
                    done();
                };
                let parentConductor = Mocks.makeLinearSequenceConductor([], null, {}, null, errorCb);
                let childConductor = Mocks.makeLinearSequenceConductor([], parentConductor);

                childConductor.error('Error occurred');
            });
        });
        describe('update', () => {
            it('should cause the update callback function provided to be called if invoked', (done) => {
                let updateCb = function(message: string){
                    expect(message).to.equal('Updating...');
                    done();
                };
                let conductor = Mocks.makeLinearSequenceConductor([], null, {}, null, null, updateCb);

                conductor.update('Updating...');
            });
            it('should invoke the update function on a parent sequence when invoked on a child sequence', (done) => {
                let updateCb = function(message: string){
                    expect(message).to.equal('Updating...');
                    done();
                };
                let parentConductor = Mocks.makeLinearSequenceConductor([], null, {}, null, null, updateCb);
                let childConductor = Mocks.makeLinearSequenceConductor([], parentConductor);

                childConductor.update('Updating...');
            });
        });
    });
    describe('Linear Sequence Conductor', () => {
        describe('_onRunComplete', () => {
            it('should cause the success callback to be invoked with the feedback argument when ok is true', (done) => {
                let successCb = function(result: any){
                    expect(result).to.equal('Success!');
                    done();
                };
                let conductor = Mocks.makeLinearSequenceConductor([], null, {}, successCb);

                conductor._onRunComplete(true, 'Success!');
            });
            it('should cause the error callback to be invoked with the feedback argument when ok is false', (done) => {
                let errorCb = function(message: string){
                    expect(message).to.equal('Error:(');
                    done();
                };
                let conductor = Mocks.makeLinearSequenceConductor([], null, {}, null, errorCb);

                conductor._onRunComplete(false, 'Error:(');
            });
            it('should cause the finally callback to be invoked on either success or error', (done) => {
                var test: number = 0;
                let successCb = function(result: any){
                    test += 5;
                };
                let errorCb = function(result: any){
                    test += 3;
                };
                let finallyCb = function() {
                    if(test > 5) {
                        expect(test).to.equal(8);
                        done();
                    }
                }
                let conductorA = Mocks.makeLinearSequenceConductor([], null, {}, successCb, errorCb, null, finallyCb);
                let conductorB = Mocks.makeLinearSequenceConductor([], null, {}, successCb, errorCb, null, finallyCb);

                conductorA._onRunComplete(true, null);
                conductorB._onRunComplete(false, null);
            });
            it('should invoke the next execution target on a parent sequence when called on a child sequence', (done) => {
                let sequence = [
                    function(ci: IConductorInterface) {
                        done();
                    }
                ];
                let parentConductor = Mocks.makeLinearSequenceConductor(sequence, null, {});
                let childConductor = Mocks.makeLinearSequenceConductor([], parentConductor);

                childConductor._onRunComplete(true, null);
            });
            it('should ensure that variables declared in a child sequence do not `leak` out to the parent sequence', (done) => {
                var calledParentUnitFunction = false;
                let childSequence = [
                    function(ci: IConductorInterface) {
                        ci.lets.childVar = 'child';
                    },
                    function(ci: IConductorInterface) {
                        expect(calledParentUnitFunction).to.be.false;
                        expect(ci.lets.childVar).to.equal('child');
                    }
                ];
                let parentSequence = [
                    function(ci: IConductorInterface) {
                        calledParentUnitFunction = true;
                        expect(ci.lets.childVar).to.be.undefined;
                        done();
                    }
                ];
                let parentConductor = Mocks.makeLinearSequenceConductor(parentSequence, null, {});
                let childConductor = Mocks.makeLinearSequenceConductor(childSequence, parentConductor);
                childConductor.start();
                childConductor.next();

                childConductor._onRunComplete(true, null);
            });
        });
    });
});

let SequenceConductorsSpec = {};
export { SequenceConductorsSpec };