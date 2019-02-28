import {describe} from 'mocha';
import { expect } from 'chai';
import { Mocks } from './mock-repository';
import { IConductorInterface } from '../lib/interfaces/conductor-ui';
import { ForEachSequenceConductorBuilder } from '../lib/conductor-builders/foreach-builder';
import { WhileSequenceConductorBuilder } from '../lib/conductor-builders/while-builder';
import { ConditionalSequenceConductorBuilder } from '../lib/conductor-builders/conditional-builder';
import { WhileSequenceConductor } from '../lib/conductors/while-cq-conductor';
import { ForEachSequenceConductor } from '../lib/conductors/foreach-cq-conductor';
import { NormalMap } from '../lib/types/primary-types';

describe('SequenceConductors', () => {
    describe('Common Sequence Conductor Functions', () => {
        describe('next', () => {
            it('should cause the next invocation target in a sequence to be invoked', (done) => {
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
    describe('Common Iterating Sequence Conductor Functions', () => {
        describe('break', () => {
            it('should invoke the next invocation target on its parent sequence', (done) => {
                let sequence = [
                    function(ci: IConductorInterface) {
                        done();
                    }
                ];
                let parentConductor = Mocks.makeLinearSequenceConductor(sequence, null, {});
                let iteratingConductor = new WhileSequenceConductor(parentConductor, [], true, false);

                iteratingConductor.break();
            });
            it('should ensure that variables declared in an iterating sequence do not `leak` out to the parent sequence', (done) => {
                var calledParentUnitFunction = false;
                let iteratingSequence = [
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
                var parentConductor = Mocks.makeLinearSequenceConductor(parentSequence, null, {});
                var iteratingConductor = new ForEachSequenceConductor(parentConductor, iteratingSequence, [1]);
                iteratingConductor.start();
                iteratingConductor.next();

                iteratingConductor.break();
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
            it('should invoke the next invocation target on a parent sequence when called on a child sequence', (done) => {
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
    describe('While Sequence Conductor', () => {
        describe('_onRunComplete', () => {
            it('should invoke the next invocation target on its parent sequence when its predicate resolves to false', (done) => {
                let sequence = [
                    function(ci: IConductorInterface) {
                        done();
                    }
                ];
                let parentConductor = Mocks.makeLinearSequenceConductor(sequence, null, {});
                let whileConductor = new WhileSequenceConductor(parentConductor, [], false, false);

                whileConductor._onRunComplete(true);
            });
            it('should cause the conductor to traverse its sequence at least once when doWhile is true', (done) => {
                let whileSequence = [
                    function(ci: IConductorInterface) {
                        ci.lets.whileTraversed = true;
                    }
                ];
                let parentSequence = [
                    function(ci: IConductorInterface) {
                        expect(ci.lets.whileTraversed).to.be.true;
                        done();
                    }
                ];
                var parentConductor = Mocks.makeLinearSequenceConductor(parentSequence, null, {whileTraversed: false});
                var whileConductor = new WhileSequenceConductor(parentConductor, whileSequence, false, true);
                
                whileConductor._onRunComplete(true); // should traverse sequence and set doWhile = false

                expect(whileConductor._.doWhile).to.be.false;
                whileConductor._onRunComplete(true); // now doWhile false and predicate false, should yield to parent
            });
            it('should cause the conductor to traverse its sequence again while the predicate still resolves to true', (done) => {
                let whileSequence = [
                    function(ci: IConductorInterface) {
                        ci.lets.loopCount++;
                    }
                ];
                let parentSequence = [
                    function(ci: IConductorInterface) {
                        expect(ci.lets.loopCount).to.equal(3);
                        done();
                    }
                ];
                var parentConductor = Mocks.makeLinearSequenceConductor(parentSequence, null, {loopCount: 0});
                var whileConductor = new WhileSequenceConductor(parentConductor, whileSequence, function predicate(lets: NormalMap){
                    return lets.loopCount < 3;
                }, false);
                whileConductor._onRunComplete(true); //loopCount === 0 (true)
                whileConductor._onRunComplete(true); //loopCount === 1 (true)
                whileConductor._onRunComplete(true); //loopCount === 2 (true)

                whileConductor._onRunComplete(true); //loopCount === 3 (false; should stop here)
            });
            it('should ensure that variables declared in this sequence do not `leak` out to the parent sequence', (done) => {
                var calledParentUnitFunction = false;
                let whileSequence = [
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
                var parentConductor = Mocks.makeLinearSequenceConductor(parentSequence, null, {});
                var whileConductor = new WhileSequenceConductor(parentConductor, whileSequence, false, true);
                whileConductor.start();
                whileConductor.next();

                whileConductor._onRunComplete(true);
            });
            it('should ensure that variables declared during one sequence traversal go out of scope in a subsequent traversal', (done) => {
                let whileSequence = [
                    function(ci: IConductorInterface) {
                        expect(ci.lets.justDeclared).to.be.undefined;
                        ci.lets.justDeclared = true;
                    },
                    function(ci: IConductorInterface) {
                        expect(ci.lets.justDeclared).to.be.true;
                        ci.lets.loopCount++;
                    }
                ];
                let parentSequence = [
                    function(ci: IConductorInterface) {
                        done();
                    }
                ];
                var parentConductor = Mocks.makeLinearSequenceConductor(parentSequence, null, {loopCount: 0});
                var whileConductor = new WhileSequenceConductor(parentConductor, whileSequence, 
                    function(lets: NormalMap){ return lets.loopCount < 2; }, true);
                whileConductor.start(); // loopCount === 0 (true)
                whileConductor.next();
                whileConductor._onRunComplete(true); // loopCount === 1 (true)
                whileConductor.next();

                whileConductor._onRunComplete(true); // loopCount === 2 (false, yields to parent sequence)
            });
        });
    });
    describe('For Each Sequence Conductor', () => {
        describe('_onRunComplete', () => {
            it('should invoke the next invocation target on its parent sequence when traversal has been performed for every collection item', (done) => {
                let sequence = [
                    function(ci: IConductorInterface) {
                        done();
                    }
                ];
                let parentConductor = Mocks.makeLinearSequenceConductor(sequence, null, {});
                let foreachConductor = new ForEachSequenceConductor(parentConductor, [], []);

                foreachConductor._onRunComplete(true);
            });
            it('should traverse its sequence for every item in a collection', (done) => {
                let collection = { a: 'foo', b: 'bar', c: 'baz' };
                let foreachSequence = [
                    function(ci: IConductorInterface) {
                        let l = ci.lets.loopCount;
                        switch(ci.lets.loopCount){
                            case 0:
                                expect(foreachConductor._.iterationProperties.$key).to.equal('a');
                                expect(foreachConductor._.iterationProperties.$item).to.equal('foo');
                                expect(foreachConductor._.iterationProperties.$object).to.equal(collection);
                            break;
                            case 1:
                                expect(foreachConductor._.iterationProperties.$key).to.equal('b');
                                expect(foreachConductor._.iterationProperties.$item).to.equal('bar');
                                expect(foreachConductor._.iterationProperties.$object).to.equal(collection);
                            break;
                            case 2:
                                expect(foreachConductor._.iterationProperties.$key).to.equal('c');
                                expect(foreachConductor._.iterationProperties.$item).to.equal('baz');
                                expect(foreachConductor._.iterationProperties.$object).to.equal(collection);
                            break;
                            default:
                                expect.fail('Sequence called too many times')
                            break;
                        }
                        ci.lets.loopCount++;
                    }
                ];
                let parentSequence = [
                    function(ci: IConductorInterface) {
                        done();
                    }
                ];
                var parentConductor = Mocks.makeLinearSequenceConductor(parentSequence, null, {loopCount: 0});
                var foreachConductor = new ForEachSequenceConductor(parentConductor, foreachSequence, collection);
                foreachConductor._onRunComplete(true); // a
                foreachConductor._onRunComplete(true); // b
                foreachConductor._onRunComplete(true); // c

                foreachConductor._onRunComplete(true); // all items have been traversed, should stop here
            });
            it('should ensure that variables declared in this sequence do not `leak` out to the parent sequence', (done) => {
                var calledParentUnitFunction = false;
                let foreachSequence = [
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
                var parentConductor = Mocks.makeLinearSequenceConductor(parentSequence, null, {});
                var foreachConductor = new ForEachSequenceConductor(parentConductor, foreachSequence, [1]);
                foreachConductor.start();
                foreachConductor.next();

                foreachConductor._onRunComplete(true);
            });
            it('should ensure that variables declared during one sequence traversal go out of scope in a subsequent traversal', (done) => {
                let foreachSequence = [
                    function(ci: IConductorInterface) {
                        expect(ci.lets.justDeclared).to.be.undefined;
                        ci.lets.justDeclared = true;
                    },
                    function(ci: IConductorInterface) {
                        expect(ci.lets.justDeclared).to.be.true;
                    }
                ];
                let parentSequence = [
                    function(ci: IConductorInterface) {
                        done();
                    }
                ];
                var parentConductor = Mocks.makeLinearSequenceConductor(parentSequence, null, {loopCount: 0});
                var whileConductor = new ForEachSequenceConductor(parentConductor, foreachSequence, [1, 2]);
                whileConductor.start(); // index 0
                whileConductor.next();
                whileConductor._onRunComplete(true); // index 1
                whileConductor.next();

                whileConductor._onRunComplete(true); // all array members traversed, yields to parent sequence
            });
        });
    });
});

let SequenceConductorsSpec = {};
export { SequenceConductorsSpec };