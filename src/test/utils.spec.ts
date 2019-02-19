import {describe} from 'mocha';
import { expect } from 'chai';
import { utils } from '../lib/utils/main-utils';
import { ValueTransform } from '../lib/enums/value-transform';

describe('General Utility Objects', () => {
    describe('Main Utilities', () => {
        describe('isNull', () => {
            it('Should only return true if the given value is null', () => {
                let vNull = utils.isNull(null);
                let vUndefined = utils.isNull(void 0);
                let vNumber = utils.isNull(1);

                expect(vNull, 'null should return true').to.be.true;
                expect(vUndefined, 'undefined should return false').to.be.false;
                expect(vNumber, 'number should return false').to.be.false;
            });
        });
        describe('isUndefined', () => {
            it('Should only return true if the given value is undefined', () => {
                let vNull = utils.isUndefined(null);
                let vUndefined = utils.isUndefined(void 0);
                let vNumber = utils.isUndefined(1);

                expect(vUndefined, 'undefined should return true').to.be.true;
                expect(vNull, 'null should return false').to.be.false;
                expect(vNumber, 'number should return false').to.be.false;
            });
        });
        describe('isNullOrUndefined', () => {
            it('Should only return true if the given value is null or undefined', () => {
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
    });

    describe('Conductor Interface Utilities', () => {});
});

