import { Primitive, VariableTypes } from "../herramientas/tipos";
import { Node, Statement } from "../abstract/ast";
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

    getAST(): Node {
        let node: Node = new Node("VECTOR CONTENT []");

        if (this.values && (this.values.length > 0) && this.values[0] instanceof Vector){
            for (let vector of this.values){
                let contentVector: Node = new Node("VECTOR CONTENT []");
                for (let item of (vector as Vector).values){
                    contentVector.addChildsNode((item as Statement).getAST());
                }
                node.addChildsNode(contentVector);
            }
        } else {
            for (let item of this.values){
                node.addChildsNode(item.getAST());
            }
        }
        return node;
    }

}
