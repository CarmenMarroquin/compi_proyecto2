import { Node, Statement } from "../abstract/ast";
import { Exception } from "../errores";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import Tree from "../herramientas/arbol";
import { Primitive, VariableTypes } from "../herramientas/tipos";
import Symbol from "../herramientas/simbolos";


export class SetVar implements Statement {
    public id: string;
    public expression: Statement;
    public line;
    public column;

    constructor(id: string, expression: Statement, line: number, column: number){
        this.id = id;
        this.expression = expression;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, null);
    }

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
            let err = new Exception("Semantic", `Type: ${value.type} can't be assigned to variable of type: ${symbol.type}`, this.line, this.column, table.name);
            tree.errors.push(err); throw err;
        }

        switch (symbol.symType){
            case VariableTypes.VAR: {
                try {
                    result = table.updateSymbol(new Symbol(this.id, value.type, value.value, VariableTypes.VAR, this.line, this.column, table));
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case VariableTypes.CONST: {
                let err = new Exception("Semantic", `Constant has already beign assigned`, this.line, this.column, table.name);
                tree.errors.push(err); throw err;
            }
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
