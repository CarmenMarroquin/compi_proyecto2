import { Node, Statement } from "../abstract/ast";
import { Exception } from "../errores";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import Tree from "../herramientas/arbol";
import { Primitive, VariableTypes, IncDec } from "../herramientas/tipos";
import Symbol from "../herramientas/simbolos";
import { Vector } from "../expresiones/vector";



export class IncDecVar implements Statement {
    public id: string;
    public op: IncDec;
    public line;
    public column;

    constructor(id: string, op: IncDec, line: number, column: number){
        this.id = id;
        this.op = op;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, null);
    }

    interpret(tree: Tree, table: Environment) {
        let symbol: Symbol;

        let result: any;

        try {
            symbol = table.getSymbol(new Symbol(this.id, Primitive.NULL, null, VariableTypes.ARRAY,this.line, this.column, table));
        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }

        switch (symbol.symType){
            case VariableTypes.VAR: {
                try {
                    if ((symbol.type === Primitive.INT || symbol.type === Primitive.DOUBLE) && (this.op === IncDec.INC)){
                        symbol.value += 1;
                        result = table.updateSymbol(new Symbol(this.id, symbol.type, symbol.value, VariableTypes.VAR, this.line, this.column, table));
                    } else if (symbol.type === Primitive.INT || symbol.type === Primitive.DOUBLE){
                        symbol.value -= 1;
                        result = table.updateSymbol(new Symbol(this.id, symbol.type, symbol.value, VariableTypes.VAR, this.line, this.column, table));
                    } else {
                        let err = new Exception("Semantic", `Type ${symbol.type} cannot be modified with ${this.op}`, this.line, this.column, table.name);
                        tree.errors.push(err); throw err;
                    }
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
                break;
            }
            case VariableTypes.CONST: {
                let err = new Exception("Semantic", `Constant "${symbol.id}" has already beign assigned`, this.line, this.column, table.name);
                tree.errors.push(err); throw err;
            }
        }
    }

    getAST(): Node{
        let node: Node = new Node("INC or DEC");
        node.addChild(this.id + " " + this.op);
        return node;
    }

    getCST(): Node {
        return new Node("Node");
    }
}
