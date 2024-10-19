import { Node, Statement } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Primitive, VariableTypes } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import Symbol from "../herramientas/simbolos";


export class CallVar implements Statement {
    public id: string;
    public line: number;
    public column: number;

    constructor(id: string, line: number, column: number,){
        this.id = id;
        this.line = line;
        this.column = column;
    }

    interpret(tree: Tree, table: Environment) {
        return undefined;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        let symbol: Symbol;
        try {
            symbol = table.getSymbol(new Symbol(this.id, Primitive.NULL, null, VariableTypes.VAR, this.line, this.column, table));
        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }

        return new ReturnType(symbol.type, symbol.value);
    }

    getCST(): Node {
        let node: Node = new Node("CallVar");
        node.addChild(this.id);
        return node;
    }

    getAST(): Node {
        return new Node(this.id);
    }


}
