import {describe} from 'mocha';
import { expect } from 'chai';
import { utils } from '../lib/utils/main-utils';
import { ValueTransform } from '../lib/enums/value-transform';
import { Mocks } from './mock-repository';
import { ucUtils } from '../lib/utils/conductor-ui-utils';

describe('Utility Objects', () => {
    describe('General Utilities', () => {
        describe('isNull', () => {
            it('should only return true if the given value is null', () => {
                let vNull = utils.isNull(null);
                let vUndefined = utils.isNull(void 0);
                let vNumber = utils.isNull(1);

                expect(vNull, 'null should return true').to.be.true;
                expect(vUndefined, 'undefined should return false').to.be.false;
                expect(vNumber, 'number should return false').to.be.false;
            });
        });
        describe('isUndefined', () => {
            it('should only return true if the given value is undefined', () => {
                let vNull = utils.isUndefined(null);
                let vUndefined = utils.isUndefined(void 0);
                let vNumber = utils.isUndefined(1);

                expect(vUndefined, 'undefined should return true').to.be.true;
                expect(vNull, 'null should return false').to.be.false;
                expect(vNumber, 'number should return false').to.be.false;
            });
        });
        describe('isNullOrUndefined', () => {
            it('should only return true if the given value is null or undefined', () => {
                let vNull = utils.isNullOrUndefined(null);
                let vUndefined = utils.isNullOrUndefined(void 0);
                let vNumber = utils.isNullOrUndefined(1);

                expect(vUndefined, 'undefined should return true').to.be.true;
                expect(vNull, 'null should return true').to.be.true;
                expect(vNumber, 'number should return false').to.be.false;
            });
        });
        describe('isString', () => {
            it('should only return true if the given value is a string', () => {
                let vString = utils.isString('string');
                let vNumber = utils.isString(1);

                expect(vString, 'string should return true').to.be.true;
                expect(vNumber, 'number should return false').to.be.false;
            });
        });
        describe('isNullOrWhiteSpace', () => {
            it('should only return true if the given value is null, undefined, or an empty string', () => {
                let vEmptyString = utils.isNullOrWhiteSpace('');
                let vWhitespaceString = utils.isNullOrWhiteSpace('   ');
                let vFullString = utils.isNullOrWhiteSpace('string');
                let vNull = utils.isNullOrWhiteSpace(null);
                let vUndefined = utils.isNullOrWhiteSpace(void 0);

                expect(vEmptyString, 'empty string should return true').to.be.true;
                expect(vEmptyString, 'string with only whitespace should return true').to.be.true;
                expect(vUndefined, 'undefined should return true').to.be.true;
                expect(vNull, 'null should return true').to.be.true;
                expect(vFullString, 'a string with non-whitespace content should return false').to.be.false;
            });
        });
        describe('isPrimitiveValue', () => {
            it('should only return true if the given value is null, undefined, boolean, number, or string', () => {
                let vNull = utils.isPrimitiveValue(null);
                let vUndefined = utils.isPrimitiveValue(void 0);
                let vBoolean = utils.isPrimitiveValue(false);
                let vNumber = utils.isPrimitiveValue(1);
                let vString = utils.isPrimitiveValue('string');
                let vObject = utils.isPrimitiveValue({});

                expect(vUndefined, 'undefined should return true').to.be.true;
                expect(vNull, 'null should return true').to.be.true;
                expect(vBoolean, 'Boolean value should return true').to.be.true;
                expect(vNumber, 'number should return true').to.be.true;
                expect(vString, 'string should return true').to.be.true;
                expect(vObject, 'a map (object) should return false').to.be.false;
            });
        });
        describe('isFunction', () => {
            it('should only return true if the given value is a function', () => {
                let vFunction = utils.isFunction(function(){});
                let vObject = utils.isFunction({});

                expect(vFunction, 'a function should return true').to.be.true;
                expect(vObject, 'a map (object) should return false').to.be.false;
            });
        });
        describe('isArray', () => {
            it('should only return true if the given value is an array', () => {
                let vArray = utils.isArray([]);
                let vObject = utils.isArray({});

                expect(vArray, 'an array should return true').to.be.true;
                expect(vObject, 'a map (object) should return false').to.be.false;
            });
        });
        describe('getKeys', () => {
            it('should return the keys of an object', () => {
                let vKeys = utils.getKeys({a: '', b: '', c: '' });

                expect(vKeys[0]).to.equal('a', 'incorrect value at index 0');
                expect(vKeys[1]).to.equal('b', 'incorrect value at index 1');
                expect(vKeys[2]).to.equal('c', 'incorrect value at index 2');
            });
            it('should return the indices of an array', () => {
                let vKeys = utils.getKeys(['a', 'b', 'c']);

                expect(vKeys[0]).to.equal('0', 'incorrect value at index 0');
                expect(vKeys[1]).to.equal('1', 'incorrect value at index 1');
                expect(vKeys[2]).to.equal('2', 'incorrect value at index 2');
            });
        });
        describe('foreach', () => {
            it('should iterate over the properties of an object', () => {
                let result: string = '{';
                utils.foreach({a: 'x', b: 'y', c: 'z' }, (val, key) => {
                    result += ` ${key}:${val}`;
                });
                result += " }";

                expect(result).to.equal('{ a:x b:y c:z }');
            });
            it('should iterate over the members of an array', () => {
                let result: string = '[';
                utils.foreach(['x','y', 'z'], (val, idx) => {
                    result += ` ${idx}:${val}`;
                });
                result += " ]";

                expect(result).to.equal('[ 0:x 1:y 2:z ]');
            });
            it('should iterate over the characters in a string', () => {
                let result:string[] = [];
                utils.foreach('xyz', (val) => {
                    result.push(val);
                });

                expect(result[0]).to.equal('x', 'incorrect value at index 0');
                expect(result[1]).to.equal('y', 'incorrect value at index 1');
                expect(result[2]).to.equal('z', 'incorrect value at index 2');
            });
            it('should break when the iteration function returns false', () => {
                let result: string = '{';
                utils.foreach({a: 'x', b: 'y', c: 'z' }, (val, key) => {
                    result += ` ${key}:${val}`;
                    if(val === 'y') {
                        return false;
                    }
                });
                result += " }";

                expect(result).to.equal('{ a:x b:y }');
            });
        });
        describe('isAnIteratingSequenceConductor', () => {
            it('should only return true if the given object has a signature that would suggest it is an IteratingSequenceConductor', () => {
                let vISequenceConductor = utils.isAnIteratingSequenceConductor({
                    break: function(){},
                    continue: function(){}
                });
                let vObject = utils.isAnIteratingSequenceConductor({});

                expect(vISequenceConductor, 'an object with a signature similar to an ISC should return true').to.be.true;
                expect(vObject, 'an empty map (object) should return false').to.be.false;
            });
        });
        describe('parsePropertyString', () => {
            it('should throw an error if the input string is improperly formatted', () => {
                expect(utils.parsePropertyString.bind(utils, 'a..b')).to
                    .throw("Improperly formed property string 'a..b' could not be parsed.");
            });
            it('should correctly interpret a properly formatted string', () => {
                let result = utils.parsePropertyString('a.bc.d%%%..e f g');
                
                expect(result.propertyChain[0]).to.equal('a', 'incorrect value at index 0');
                expect(result.propertyChain[1]).to.equal('bc', 'incorrect value at index 1');
                expect(result.propertyChain[2]).to.equal('d%.', 'incorrect value at index 2');
                expect(result.propertyChain[3]).to.equal('e f g', 'incorrect value at index 3');
            });
            it('should correctly specify if/how to convert the property path value to Boolean', () => {
                let vNoConvert = utils.parsePropertyString('a.b.c').valueTransform;
                let vConvert = utils.parsePropertyString('!!a.b.c').valueTransform;
                let vConvertAndInvert = utils.parsePropertyString('!a.b.c').valueTransform;
                
                expect(vNoConvert).to.equal(ValueTransform.none, "'a.b.c' should have ValueTransform.none");
                expect(vConvert).to.equal(ValueTransform.toBoolean, "'!!a.b.c' should have ValueTransform.toBoolean");
                expect(vConvertAndInvert).to.equal(ValueTransform.toInvertedBoolean, "'!a.b.c' should have ValueTransform.toInvertedBoolean");
            });
        });
        describe('resolveSequencePredicate', () => {
            it('when the predicate is a primitive value, should return the same primitive value', () => {
                let result = utils.resolveSequencePredicate(100, {}, true);

                expect(result).to.equal(100);
            });
            it('should throw an error if the predicate given resolves to a primitive, and AllowPrimitives is set to false', () => {
                expect(utils.resolveSequencePredicate.bind(utils, 100, {}, false))
                    .to.throw('Value provided for evaluation must be either an Array, a non-primitive Object, or a function that returns one of the preceding');
            });
            it('should throw an error if an empty or whitespace-only string is used as a predicate', () => {
                expect(utils.resolveSequencePredicate.bind(utils, '', {}, true))
                    .to.throw('Strings used to resolve property values on the lets object cannot be empty');
            });
            it('when the predicate is a string, should use that string to get a property on the lets object\'s value', () => {
                let lets = {
                    a: {
                        b: {
                            c: 100
                        }
                    }
                };

                let result = utils.resolveSequencePredicate('a.b.c', lets, true);

                expect(result).to.equal(100);
            });
            it('when the predicate is a function, should return the value returned from that function', () => {
                let result = utils.resolveSequencePredicate(function predicate(){
                    return 100;
                }, {}, true);

                expect(result).to.equal(100);
            });
            it('when the predicate is a function returning a string, should use that string to get a property on the lets object\'s value', () => {
                let lets = {
                    a: {
                        b: {
                            c: 100
                        }
                    }
                };

                let result = utils.resolveSequencePredicate(function predicate(){
                    return 'a.b.c';
                }, lets, true);

                expect(result).to.equal(100);
            });
            it('should throw an error if a predicate string references a child of a null/undefined property', () => {
                let lets = {
                    a: {} as any
                };
                lets.a['100% crazy property name.'] = {
                    c: {}
                };

                expect(utils.resolveSequencePredicate.bind(utils, 'a.100%% crazy property name%..c.d.e', lets, true))
                    .to.throw('Value of property \'lets.a["100% crazy property name."].c.d\' is undefined, and therefore does not have property \'e\'');
            });
        });
        describe('copyLetsObject', () => {
            it('should return a shallow copy to the given map', () => {
                let vOriginal = { a: 9, b: 8, c: 7 };

                let vCopy = utils.copyLetsObject(vOriginal, {});

                expect(vCopy.a).to.equal(9, 'incorrect value at property a');
                expect(vCopy.b).to.equal(8, 'incorrect value at property b');
                expect(vCopy.c).to.equal(7, 'incorrect value at property c');
            });
        });
        describe('updateLetsObject', () => {
            it('should update the properties in common of in the first object with values from the second', () => {
                let vFirst:any = { a: 1, c: 2 };
                let vSecond = { a: 9, b: 8, c: 7 };

                utils.updateLetsObject(vFirst, vSecond);

                expect(vFirst.a).to.equal(9, 'incorrect value at property a');
                expect(vFirst.c).to.equal(7, 'incorrect value at property c');
                expect(vFirst.b).to.be.undefined;
            });
        });
    });

    describe('Conductor Interface Utilities', () => {
        describe('getInterfaceInternals', () => {
            it('should return the `private` members of a conductor interface', () => {
                let conductor = Mocks.makeLinearSequenceConductor();
                let ci = Mocks.makeConductorInterface(conductor);

                let pvt = ucUtils.getInterfaceInternals(ci);

                expect(pvt.sequenceConductor).to.equal(conductor);
            });
        });
        describe('yieldControl', () => {
            it('should mark the given interface as no longer having control, and remove its lets object', () => {
                let ci = Mocks.makeConductorInterface();
                let pvt = ucUtils.getInterfaceInternals(ci);

                ucUtils.yieldControl(ci);

                expect(pvt.hasControl).to.be.false;
                expect(ci.lets).to.be.null;
            });
        });
        describe('validateCommandUsage', () => {
            it('should return true when the interface has not yet yielded control', () => {
                let ci = Mocks.makeConductorInterface();

                let result = ucUtils.validateCommandUsage(ci, 'next');

                expect(result).to.be.true;
            });
            it('should throw an error when the interface has already yielded control', () => {
                let ci = Mocks.makeConductorInterface();
                ucUtils.yieldControl(ci);

                let fn = ucUtils.validateCommandUsage.bind(ucUtils, ci, 'next');

                expect(fn).to.throw('Illegal call to function next(): This interface has already yielded control to the next execution target; no further calls are allowed to be made from this interface.');
            });
        });
        describe('conductorInterfaceCommand', () => {
            it('should invoke the function with the given name on the underlying sequence conductor', (done) => {
                let conductor = Mocks.makeLinearSequenceConductor(Mocks.simpleSequence, null, {}, null, null,
                function onUpdate (info: any){
                    expect(info).to.equal('success');
                    done();
                });
                let ci = Mocks.makeConductorInterface(conductor);

                ucUtils.conductorInterfaceCommand(ci, false, 'update', 'success');
            });
        });
    });
});

let UtilsSpec = {};
export { UtilsSpec };