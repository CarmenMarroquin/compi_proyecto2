import { Node, Statement } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Primitive, VariableTypes } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Vector } from "./vector";
import { Exception } from "../errores";


type VectorType = Vector;

export class NewVector implements Statement {
    public type: Primitive;
    public dimension1: Statement;
    public dimension2: Statement | undefined;
    public line: number;
    public column: number;

    constructor(type: Primitive, dimension1: Statement, dimension2: Statement | undefined, line: number, column: number,){
        this.type = type;
        this.dimension1 = dimension1;
        this.dimension2 = dimension2;
        this.line = line;
        this.column = column;
    }

    interpret(tree: Tree, table: Environment) {
        return this.getValue(tree, table);
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        try{
            let newVector: Vector;
            let length1: ReturnType = this.dimension1.getValue(tree, table);
            if (length1.type === Primitive.INT){
                if (this.dimension2 !== undefined){
                    let length2: ReturnType = this.dimension2.getValue(tree, table);
                    if (length2.type === Primitive.INT){
                        let newVectors: Vector[] = []
                        for (let i = 0; i < length1.value; i++){
                            newVectors.push(new Vector(length2.value, this.type, undefined));
                        }
                        newVector = new Vector(length1.value, VariableTypes.ARRAY, newVectors);
                        return new ReturnType(newVector.dataType, newVector);
                    } else {
                        let err = new Exception("Semantic", `Type: ${length2.type} can't be used for creating a vector`, this.line, this.column, table.name);
                        throw err;
                    }

                } else {
                    newVector = new Vector(length1.value, this.type, undefined);
                    return new ReturnType(newVector.dataType, newVector);
                }
            } else {
                let err = new Exception("Semantic", `Type: ${length1.type} can't be used for creating a vector`, this.line, this.column, table.name);
                throw err;
            }
        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }

    }

    // TODO
    getCST(): Node {
        let node: Node = new Node("Primitive");
        //node.addChild(this.value);
        return node;
    }

    getAST(): Node {
        let node: Node = new Node("VECTOR CONTENT []");
        let accessVector = "[" + this.dimension1 + "]";
        if (this.dimension2 !== undefined){
            accessVector += "[" + this.dimension2 + "]";
        }
        node.addChild(this.type);
        node.addChild(accessVector);
        return node;
    }
}
