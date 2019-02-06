import { ValueTransform } from "../enums/value-transform";

export interface IPropertyInfo {
    propertyChain: string[];
    valueTransform: ValueTransform;
}
