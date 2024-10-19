import { Primitive, VariableTypes } from "../herramientas/tipos";
import { Statement } from "../abstract/ast";
import { PrimitiveVal } from "./primitives";
import ReturnType from "../herramientas/returnType";


type ValuesTypes = Statement[] | Vector[];

export class Vector {
    public length: number;
    public dataType: VariableTypes.ARRAY | Primitive;
    public values: ValuesTypes;
    public interpretedValues: ReturnType[] = [];


    constructor(length: number, dataType: Primitive | VariableTypes.ARRAY, values: ValuesTypes | undefined){
        this.length = length;
        this.dataType = dataType;
        if (values === undefined){
            let nullValues: PrimitiveVal[] = []
            let nullReturns: ReturnType[] = []
            for (let i = 0; i < length; i++){
                nullValues.push(new PrimitiveVal("", Primitive.NULL, 0, 0));
                nullReturns.push(new ReturnType(Primitive.NULL, null));
            }
            this.values = nullValues;
            this.interpretedValues = nullReturns;
        } else {
            this.values = values;
        }
    }
}
