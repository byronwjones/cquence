import { NormalMap } from "../types/primary-types";
import { IPropertyInfo } from "../interfaces/property-info";
import { ValueTransform } from "../enums/value-transform";

let utils = (function(){
    class Utils {

        isNull (value:any): boolean {
            return value === null;
        }
    
        isUndefined (value:any): boolean {
            return value === void 0;
        }
    
        isNullOrUndefined (value:any): boolean {
            return this.isNull(value) ||
            this.isUndefined(value);
        }
    
        isString (value:any):boolean {
            return this.isItA('String', value);
        }
    
        isNullOrWhiteSpace (value:string): boolean {
            return this.isNullOrUndefined(value) ||
            !value.trim();
        }
    
        isPrimitiveValue (value:any): boolean {
            return this.isNullOrUndefined(value) ||
                value === true ||
                value === false ||
                this.isItA('Boolean', value) ||
                this.isItA('Number', value) ||
                this.isString(value);
        }
    
        isFunction (value:any): boolean {
            return this.isItA('Function', value);
        }
    
        isArray (value:any): boolean {
            //use the best technique first
            if (this.isFunction(Array.isArray)) {
                return Array.isArray(value);
            }
    
            return this.isItA('Array', value);
        }
    
        getKeys (obj:Object): string[] {
            if(this.isNullOrUndefined(obj)){
                return [];
            }

            if (this.isFunction(Object.keys)) {
                return Object.keys(obj);
            }
    
            let keys:string[] = [];
            for (let p in obj) {
                if (obj.hasOwnProperty(p)) {
                    keys.push(p);
                }
            }
    
            return keys;
        }
    
        foreach (target:string | NormalMap | any[],
                    fn:(value?:any, index?:any, obj?:any)=>any):void {
            if(this.isNullOrUndefined(target)) {
                return;
            }

            let type:string = this.isArray(target) ? 'array' :
                this.isString(target) ? 'string' : 'object';
    
            if (type === 'array') {
                let arr = target as Array<any>;
                for (let i = 0, ln = arr.length; i < ln; i++) {
                    if (fn(arr[i], i, arr) === false) { break; }
                }
            } 
            else if (type === 'string') {
                let str = target as string;
                for (let i = 0, ln = str.length; i < ln; i++) {
                    if (fn(str.charAt(i), i, str) === false) { break; }
                }
            } //object
            else {
                let obj = target as {[k:string]: any};
                let keys = this.getKeys(obj);
                for (let i = 0, ln = keys.length; i < ln; i++) {
                    let prop = keys[i];
                    if (fn(obj[prop], prop, obj) === false) { break; }
                }
            }
        }
    
        isAnIteratingSequenceConductor(obj:any): boolean {
            return !this.isNullOrUndefined(obj) &&
                    this.isFunction(obj.break) &&
                    this.isFunction(obj.continue);
        }
    
        // returns the object that is the being iterated over or evaluated for
        //  a conditional sequence, foreach/while looping sequence, etc.
        resolveSequencePredicate (value:any, lets:NormalMap, allowPrimitives:boolean): any {
            //return primitives immediately
            if (allowPrimitives && this.isPrimitiveValue(value) && !this.isString(value)) {
                return value;
            }
    
            //resolve value determined by function
            if (this.isFunction(value)) {
                value = value(lets);
            }
            //resolve string values against the lets object
            if (this.isString(value)) {
                let str = value as string;
                if (this.isNullOrWhiteSpace(str)) {
                    throw new Error('Strings used to resolve property values on the variables object cannot be empty');
                }
    
                let propertyInfo = this.parsePropertyString(str);
                let props = propertyInfo.propertyChain;
                let parent:any = lets;
                let varName = 'lets';
                let rxDottable = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
                let self = this;
                this.foreach(props, function (prop:string) {
                    //problem if parent is null/undefined
                    if (self.isNullOrUndefined(parent)) {
                        let pValue = self.isNull(parent) ? 'null' : 'undefined';
                        let errMsg = 'Value of property ' + varName + ' is ' + pValue + ', and therefore does not have property "' + prop + '"';
                        throw new Error(errMsg);
                    }
                    //get new parent value
                    parent = parent[prop];
                    if (rxDottable.test(prop)) {
                        varName += '.' + prop;
                    }
                    else {
                        varName += '["' + prop + '"]';
                    }
                });
    
                value = parent;
                if (propertyInfo.valueTransform !== ValueTransform.none) {
                    value = propertyInfo.valueTransform === ValueTransform.toBoolean ? 
                            !!value : !value;
                }
            }
    
            if (!allowPrimitives && this.isPrimitiveValue(value)) {
                throw new TypeError('Value provided for evaluation must be either an Array, a non-primitive Object, or a function that returns one of the preceding');
            }
            
            //return value information
            return value;
        }
    
        // creates a shallow copy of a lets object
        copyLetsObject(from: NormalMap, to: NormalMap): NormalMap {
            this.foreach(from, function (val, prop) {
                to[prop] = val;
            });
    
            return to;
        }
    
        updateLetsObject(objToUpdate: NormalMap, sourceObj: NormalMap): NormalMap {
            this.foreach(objToUpdate, function (val, prop) {
                objToUpdate[prop] = sourceObj[prop];
            });
    
            return objToUpdate;
        }
    
        private parsePropertyString (s:string): IPropertyInfo {
            if (this.isNullOrWhiteSpace(s)) {
                throw new Error('Property strings can not be empty or contain only whitespace characters.');
            }
            let errMsg = 'Improperly formed property string "' + s + '" could not be parsed.';
    
            //make use of unescaped exclamation points for inversion
            let invertResult = s.match(/^!+/);
            let invertCount = !!invertResult ? invertResult[0].length : 0;
            let xform: ValueTransform = ValueTransform.none;
            if (invertCount > 0) {
                s = s.substr(invertCount); //remove !'s from property string
                //transform property value to inverted boolean if number of !'s is odd, or boolean if even
                xform = (invertCount % 2) === 0 ?
                            ValueTransform.toBoolean : ValueTransform.toInvertedBoolean; 
            }
    
            let props:string[] = [], currentProp = '', esc = false, self = this;
            this.foreach(s, function (c) {
                let char = c as string;
                switch (char) {
                    case '.':
                        //add to current property if escaped
                        if (esc) {
                            currentProp = currentProp.substr(0, currentProp.length - 1) + c;
                            esc = false;
                        }
                        else {
                            //current property must have value
                            if (self.isNullOrWhiteSpace(currentProp)) {
                                throw new Error(errMsg);
                            }
                            props.push(currentProp);
                            currentProp = '';
                        }
                        break;
                    case '%':
                        if (!esc) {
                            currentProp += c;
                        }
                        esc = !esc;
                        break;
                    default:
                        //just ignore unnecessary escape sequences
                        if (esc) {
                            currentProp = currentProp.substr(0, currentProp.length - 1);
                        }
                        currentProp += c;
                        esc = false;
                        break;
                }
            });
    
            //if the last property reference is empty, the property string ended with a period,
            //  which is not allowed
            if (this.isNullOrWhiteSpace(currentProp)) {
                throw new Error(errMsg);
            }
            props.push(currentProp);
    
            return {
                propertyChain: props,
                valueTransform: xform
            };
        }
    
        private isItA(type:string, value:any): boolean {
            return !this.isNullOrUndefined(value) && Object.prototype.toString.call(value) == '[object ' + type + ']';
        }
    }

    return new Utils();
})();

export {utils};