import { Node, Statement } from "../abstract/ast";
import { Exception } from "../errores";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import Tree from "../herramientas/arbol";
import { Primitive, VariableTypes } from "../herramientas/tipos";
import Symbol from "../herramientas/simbolos";
import { Vector } from "../expresiones/vector";



export class SetVector implements Statement {
    public id: string;
    public dimension1: Statement;
    public dimension2: Statement | undefined;
    public expression: Statement;
    public line;
    public column;

    constructor(id: string, dimension1: Statement, dimension2: Statement | undefined, expression: Statement, line: number, column: number){
        this.id = id;
        this.dimension1 = dimension1;
        this.dimension2 = dimension2;
        this.expression = expression;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, null);
    }

    // TODO keep an eye in this funcion
    interpret(tree: Tree, table: Environment) {
        let value: ReturnType;
        let symbol: Symbol;

        let result: any;

        try {
            symbol = table.getSymbol(new Symbol(this.id, Primitive.NULL, null, VariableTypes.ARRAY,this.line, this.column, table));
        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }

        try {
            value = this.expression.getValue(tree, table)
        }catch(err){
            tree.errors.push(err as Exception); throw err;
        }

        if (symbol.type !== value.type){
            let err = new Exception("Semantic", `Type: ${value.type} can't be assigned to variable of type: ${symbol.type}[]`, this.line, this.column, table.name);
            tree.errors.push(err); throw err;
        }

        if (symbol.symType === VariableTypes.ARRAY && symbol.value instanceof Vector){
            let mainVector: Vector = symbol.value;
            let dimension1: ReturnType;
            // load first dimension
            try {
                dimension1 = this.dimension1.getValue(tree, table);
            }catch(err){
                tree.errors.push(err as Exception); throw err;
            }
            // if is an array of vectors
            if (mainVector.dataType === VariableTypes.ARRAY){ // If the values of the vector are more vectors
                let subVector = mainVector.values[dimension1.value];
                if (subVector instanceof Vector && this.dimension2 !== undefined){
                    // load second dimension
                    let dimension2: ReturnType;
                    try {
                        dimension2 = this.dimension2.getValue(tree, table);
                    }catch(err){
                        tree.errors.push(err as Exception); throw err;
                    }
                    subVector.interpretedValues[dimension2.value] = value;
                }
            } else { // if is a regular arry
                mainVector.interpretedValues[dimension1.value] = value;
            }
        } else {
            let err = new Exception("Semantic", `Type: ${value.type} can't be assigned to variable of type: ${symbol.symType}[]`, this.line, this.column, table.name);
            tree.errors.push(err); throw err;
        }
    }

    getAST(): Node{
        let node: Node = new Node("SET");
        node.addChild(this.id);
        node.addChildsNode(this.expression.getAST());
        return node;
    }

    getCST(): Node {
        return new Node("Node");
    }
}
