import { PrivateComposerAPI } from "../lib/composer/private-api";
import { Composer } from "../lib/composer/composer";
import { IConductorInterface } from "../lib/interfaces/conductor-ui";
import { expect } from "chai";
import { ConditionalSequenceConductorBuilder } from "../lib/conductor-builders/conditional-builder";
import { LinearSequenceConductorBuilder } from "../lib/conductor-builders/linear-builder";
import { Mocks } from "./mock-repository";
import { WhileSequenceConductorBuilder } from "../lib/conductor-builders/while-builder";
import { utils } from "../lib/utils/main-utils";
import { ConductorBuilderType } from "../lib/enums/conductor-builder-type";

describe('Function Composition API', () => {
    describe('Private API Object', () => {
        describe('getLastTargetOnCurrentBuilder', () => {
            it('should get the last invocation target on a Linear, For Each, or While sequence conductor builder', () => {
                // We start with a Linear conductor builder as the current builder -- it represents the main body of the function
                let pvtAPI = new PrivateComposerAPI(new Composer());
                let targetA = function (ci: IConductorInterface) { return 'foo'; };
                let targetB = function (ci: IConductorInterface) { return 'bar'; };
                pvtAPI.currentBuilder.add(targetA);
                pvtAPI.currentBuilder.add(targetB);

                let lastTarget = pvtAPI.getLastTargetOnCurrentBuilder();
                
                expect(lastTarget).to.equal(targetB);
            });
            it('should get the last invocation target on a Conditional sequence conductor builder', () => {
                // We start with a Linear conductor builder as the current builder -- it represents the main body of the function
                let pvtAPI = new PrivateComposerAPI(new Composer());
                let condBuilder =  new ConditionalSequenceConductorBuilder('foo');
                pvtAPI.currentBuilder = condBuilder;

                let targetA = function (ci: IConductorInterface) { return 'foo'; };
                let targetB = function (ci: IConductorInterface) { return 'bar'; };
                let targetC = function (ci: IConductorInterface) { return 'baz'; };
                pvtAPI.currentBuilder.add(targetA);
                pvtAPI.currentBuilder.add(targetB);
                condBuilder.addCondition('bar');
                pvtAPI.currentBuilder.add(targetC);

                let lastTarget = pvtAPI.getLastTargetOnCurrentBuilder();
                
                expect(lastTarget).to.equal(targetC);
            });
        });
        describe('changeCurrentBuilder', () => {
            it('should make the given builder the current builder, and add it to its predecessor\'s sequence', () => {
                // We start with a Linear conductor builder as the current builder -- it represents the main body of the function
                let pvtAPI = new PrivateComposerAPI(new Composer());
                let previousBuilder = pvtAPI.currentBuilder;
                let conditionalBuilder = new ConditionalSequenceConductorBuilder(true);

                pvtAPI.changeCurrentBuilder(conditionalBuilder);
                
                expect(previousBuilder.sequence.length).to.equal(1, 'root builder sequence should only have one invocation target');
                expect(previousBuilder.sequence[0]).to.equal(conditionalBuilder, 'conditional builder should be in the root builder\'s sequence');
                expect(pvtAPI.currentBuilder).to.equal(conditionalBuilder, 'conditional builder should be current builder');
                expect(pvtAPI.builderStack[pvtAPI.builderStack.length - 1]).to.equal(conditionalBuilder, 'conditional builder should be at the top of the builder stack');
            });
        });
        describe('configureSequence', () => {
            it('should use a composition function to define the current builder\'s sequence, then make its predecessor the current builder', () => {
                // We start with a Linear conductor builder as the current builder -- it represents the main body of the function
                let pvtAPI = new PrivateComposerAPI(new Composer());
                let secondBuilder = new LinearSequenceConductorBuilder();
                let compFuncInvoked = false;
                let compositionFn = function (composer: Composer) {
                    compFuncInvoked = true;
                };
                pvtAPI.changeCurrentBuilder(secondBuilder);

                pvtAPI.configureSequence(compositionFn);
                
                let topBuilder = pvtAPI.builderStack[pvtAPI.builderStack.length -1];
                expect(topBuilder).to.not.equal(secondBuilder, 'second builder should no longer be at the top of the builder stack');
                expect(topBuilder).to.equal(pvtAPI.currentBuilder, 'current builder should match that at the top of the builder stack');
                expect(compFuncInvoked).to.be.true;
            });
        });
        describe('whileOrDoWhile', () => {
            it('should add a While sequence conductor builder to the current builder\'s sequence', () => {
                // We start with a Linear conductor builder as the current builder -- it represents the main body of the function
                let pvtAPI = new PrivateComposerAPI(new Composer());
                let mainBuilder = pvtAPI.currentBuilder;

                pvtAPI.whileOrDoWhile(true, false, function(c: Composer){});
                
                expect(mainBuilder.sequence.length).to.equal(1, 'main sequence should contain While conductor builder');
                expect(Mocks.isThisAWhileBuilder(mainBuilder.sequence[0])).to.be.true;
                let whileBuilder = mainBuilder.sequence[0] as WhileSequenceConductorBuilder;
                expect(whileBuilder.doWhile).to.be.false;
            });
            it('should add a Do...While sequence conductor builder to the current builder\'s sequence', () => {
                // We start with a Linear conductor builder as the current builder -- it represents the main body of the function
                let pvtAPI = new PrivateComposerAPI(new Composer());
                let mainBuilder = pvtAPI.currentBuilder;

                pvtAPI.whileOrDoWhile(true, true, function(c: Composer){});
                
                expect(mainBuilder.sequence.length).to.equal(1, 'main sequence should contain While conductor builder');
                expect(Mocks.isThisAWhileBuilder(mainBuilder.sequence[0])).to.be.true;
                let whileBuilder = mainBuilder.sequence[0] as WhileSequenceConductorBuilder;
                expect(whileBuilder.doWhile).to.be.true;
            });
        });
        describe('compile', () => {
            it('should return a function', () => {
                let pvtAPI = new PrivateComposerAPI(new Composer());

                let fn = pvtAPI.compile();

                expect(utils.isFunction(fn)).to.be.true;
            });
        });
    });
});

let ComposerSpec = {};
export { ComposerSpec };