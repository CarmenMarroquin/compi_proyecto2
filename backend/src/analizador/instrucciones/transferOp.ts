import { Node, Statement } from "../abstract/ast";
import { Exception } from "../errores";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import Tree from "../herramientas/arbol";
import { Primitive, TransferOp } from "../herramientas/tipos";
import Symbol from "../herramientas/simbolos";


export class Break implements Statement {
    public line;
    public column;

    constructor(line: number, column: number){
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(TransferOp.BREAK, null);
    }

    interpret(tree: Tree, table: Environment) {
        return this.getValue(tree, table);
    }

    getAST(): Node{
        return new Node("Break");
    }

    getCST(): Node {
        return new Node("Node");
    }
}

export class Continue implements Statement {
    public line;
    public column;

    constructor(line: number, column: number){
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(TransferOp.CONTINUE, null);
    }

    interpret(tree: Tree, table: Environment) {
        return this.getValue(tree, table);
    }

    getAST(): Node{
        return new Node("Continue");
    }

    getCST(): Node {
        return new Node("Continue");
    }
}

export class Return implements Statement {
    public line;
    public column;
    public expression: Statement | undefined;

    constructor(expression: Statement | undefined, line: number, column: number, public func?:(arg: ReturnType) => ReturnType ){
        this.expression = expression;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        if (this.expression === undefined){
            return new ReturnType(TransferOp.RETURN, null);
        }

        let res: ReturnType;
        try {
            res = this.expression.getValue(tree, table);
            if (this.func !== undefined){
                res = this.func(res)
            }
        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }

        return new ReturnType(TransferOp.RETURN, res);
    }

    interpret(tree: Tree, table: Environment) {
        return this.getValue(tree, table);
    }

    getAST(): Node{
        return new Node("node");
    }

    getCST(): Node {
        if (this.expression !== undefined){
            let node = new Node("Return");
            node.addChildsNode(this.expression.getAST());
            return node;
        }
        return new Node("Return");
    }
}
