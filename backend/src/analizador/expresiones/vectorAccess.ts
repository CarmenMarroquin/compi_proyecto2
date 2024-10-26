import { Node, Statement } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Primitive, RelationalOperator, VariableTypes } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import { array, boolean } from "joi";
import Symbol from "../herramientas/simbolos";
import { Vector } from "./vector";


export class VectorAccess implements Statement {
    public id: string;
    public dimension1: Statement;
    public dimension2: Statement | undefined;
    public line: number;
    public column: number;
    public foundedValue: Statement | Vector;

    constructor(id: string, dimension1: Statement, dimension2: Statement | undefined, line: number, column: number,){
        this.id = id;
        this.dimension1 = dimension1;
        this.dimension2 = dimension2;
        this.line = line;
        this.column = column;
        this.foundedValue = new Vector(0, Primitive.NULL, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        return undefined;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        let newReturnType: ReturnType;
        let symbol: Symbol;

        try {
            symbol = table.getSymbol(new Symbol(this.id, Primitive.NULL, null, VariableTypes.VAR, this.line, this.column, table));
            let dimension1: ReturnType = this.dimension1.getValue(tree, table);
            if (symbol.symType === VariableTypes.ARRAY){
                if (symbol.value instanceof Vector){
                    // COMMENT THIS CONDITION
                    if (symbol.value.dataType === VariableTypes.ARRAY /*&& Array.isArray(symbol.value)*/){
                        let firstValue: Vector | Statement;
                        // CHECK types of first value
                        if (dimension1.type === Primitive.INT && dimension1.value >= 0 && dimension1.value < symbol.value.values.length){
                            // ACCESS FIRST VALUE
                            firstValue = symbol.value.values[dimension1.value];
                            // CHECK IF FIRST VALUE IS A VECTOR AND IF DIMENSION 2 IS DEFINED
                            if (firstValue instanceof Vector && this.dimension2 !== undefined){
                                let dimension2: ReturnType = this.dimension2.getValue(tree, table);
                                // CHECK TYPES FOR DIMENSION 2
                                if (dimension2.type === Primitive.INT && dimension2.value >= 0 && dimension2.value < firstValue.length){
                                    // ACCES RETURN TYPE OF THE ITEM
                                    this.foundedValue = firstValue.values[dimension2.value];
                                    let secondValue: ReturnType = firstValue.interpretedValues[dimension2.value];
                                    // ASSIGN TO NEW RETURNTYPE
                                    newReturnType = secondValue;
                                } else {
                                    let err = new Exception("Semantic", `Cannot acces vector with variable of value ${dimension2}`, this.line, this.column, table.name);
                                    throw err;
                                }
                            } else {
                                let err = new Exception("Semantic", `Cannot acces vector with variable of value undefined`, this.line, this.column, table.name);
                                throw err;
                            }
                        } else {
                            let err = new Exception("Semantic", `Cannot acces vector with variable of value ${dimension1}`, this.line, this.column, table.name);
                            throw err;
                        }
                    } else { // IF THIS IS A REGULAR ARRAY OF STATEMENTS
                        if (dimension1.type === Primitive.INT && dimension1.value >= 0 && dimension1.value < symbol.value.length){
                            this.foundedValue = symbol.value.values[dimension1.value];
                            newReturnType = symbol.value.interpretedValues[dimension1.value];
                        } else {
                            let err = new Exception("Semantic", `Cannot acces vector with variable of value ${dimension1}`, this.line, this.column, table.name);
                            throw err;
                        }
                    }
                } else {
                    let err = new Exception("Semantic", `Symbol is not of type Vector`, this.line, this.column, table.name);
                    throw err;
                }
            } else {
                let err = new Exception("Semantic", `Variable of type ${symbol.symType} can't be Accessed with "[]" notation`, this.line, this.column, table.name);
                throw err;
            }
        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }

        return newReturnType;
    }

    // TODO
    getCST(): Node {
        let node: Node = new Node("Relational Expression");
        //node.addChildsNode(this.leftExp.getCST());
        //node.addChild(this.operator.toString());
        //node.addChildsNode(this.rightExp.getCST());
        return node;
    }

    // TODO
    getAST(): Node {
        //let node: Node = new Node(this.operator);
        //node.addChildsNode(this.leftExp.getAST());
        //node.addChildsNode(this.rightExp.getAST());
        let node: Node = new Node("VECTOR ACCESS");
        let accessVector = "[" + this.dimension1 + "]";
        if (this.dimension2 !== undefined){
            accessVector += "[" + this.dimension2 + "]";
        }
        node.addChild(this.id);
        node.addChildsNode(this.foundedValue.getAST());
        return node;

    }


}
