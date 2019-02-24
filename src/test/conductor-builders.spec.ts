import {describe} from 'mocha';
import { expect } from 'chai';
import { utils } from '../lib/utils/main-utils';
import { Mocks } from './mock-repository';
import { LinearSequenceConductorBuilder } from '../lib/conductor-builders/linear-builder';
import { IConductorInterface } from '../lib/interfaces/conductor-ui';

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
});

let SequenceConductorBuildersSpec = {};
export { SequenceConductorBuildersSpec };