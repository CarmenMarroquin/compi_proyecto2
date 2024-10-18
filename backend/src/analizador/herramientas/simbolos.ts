import Environment from "./entornos";
import { Functions, Primitive, ValueType, VariableTypes } from "./tipos";

export default class Symbol{
    constructor(
        public id: string,
        public type: ValueType | VariableTypes.ARRAY,
        public value: any,
        public symType: Functions | VariableTypes,
        public row: number,
        public column: number,
        public environment: Environment
    ){}
}
