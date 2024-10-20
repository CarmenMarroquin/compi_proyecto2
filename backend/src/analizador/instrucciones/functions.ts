import { Statement, Node } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Any, Functions, Primitive } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import { CodeBlock } from "./codeBlock";
import Symbol from "../herramientas/simbolos";
import { CallVar } from "../expresiones/callVar";

export interface VarArgs {
    id: string, type: Primitive, deft?: Statement
}


export abstract class Func implements Statement{
    constructor(
        public retType: Primitive | undefined,
        public id: string,
        public args: Array<VarArgs>,
        public block: CodeBlock,
        public line: number,
        public column: number,
    ){}
    abstract getValue(tree: Tree, table: Environment): ReturnType;
    abstract interpret(tree: Tree, table: Environment): any;
    abstract getCST(): Node;
    abstract getAST(): Node;
}

export class Function extends Func {
    constructor(retType: Primitive, id: string, args: Array<VarArgs>, block: CodeBlock, line: number, column: number,){
        super(retType, id, args, block, line, column);
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        let symbol: Symbol;
        symbol = new Symbol(
            this.id,
            Functions.FUNC,
            this,
            Functions.FUNC,
            this.line,
            this.column,
            table
        );

        try{
            table.setSymbol(symbol);
        }catch(err){
            tree.errors.push(err as Exception); throw err;
        }
    }

    getCST(): Node {
        return new Node("Node");
    }

    getAST(): Node {
        let node = new Node("FUNCTION");
        let argsNode = new Node("ARGUMENTS")
        node.addChild(this.id);
        for (let arg of this.args){
            argsNode.addChild(arg.id);
        }
        let returnNode = new Node("RETURNS");
        if (this.retType !== undefined){
            returnNode.addChild(this.retType.toUpperCase());
        }
        node.addChildsNode(argsNode);
        node.addChildsNode(returnNode);
        node.addChildsNode(this.block.getAST());
        return node;
    }
}

export class NativeFunc extends Func {
    constructor(public retType: Primitive, public id: string, public args: Array<VarArgs>, public func: (...args: ReturnType[]) => ReturnType, public line: number, public column: number){
        super(retType, id, args, new CodeBlock([], line, column), line, column);
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        let resVal: Array<ReturnType> = [];
        for (let arg of this.args){
            let callvar = new CallVar(arg.id, 0, 0);
            resVal.push(callvar.getValue(tree, table));
        }
        return this.func(...resVal);

    }
    interpret(tree: Tree, table: Environment) {
        throw new Error("Method not implemented.");
    }
    getCST(): Node {
        throw new Error("Method not implemented.");
    }
    getAST(): Node {
        throw new Error("Method not implemented.");
    }
}


export class Method extends Func {
    constructor(retType: Primitive, id: string, args: Array<VarArgs>, block: CodeBlock, line: number, column: number,){
        super(retType, id, args, block, line, column);
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        let symbol: Symbol;
        symbol = new Symbol(
            this.id,
            Functions.METHOD,
            this,
            Functions.METHOD,
            this.line,
            this.column,
            table
        );

        try {
            table.setSymbol(symbol);
        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }
    }

    getCST(): Node {
        return new Node("Node");
    }

    getAST(): Node {
        let node = new Node("METHOD");
        node.addChild(this.id);
        if (this.args !== undefined){
            let argsNode = new Node("ARGUMENTS")
            for (let arg of this.args) {
                argsNode.addChild(arg.id);
            }
            node.addChildsNode(argsNode);
        }
        node.addChildsNode(this.block.getAST());
        return node;
    }
}
