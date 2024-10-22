import { Node, Statement } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { ArithmeticOperator, Primitive, RelationalOperator } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import Symbol from "../herramientas/simbolos";
import { PrimitiveVal } from "./primitives";

type Ret = { left: ReturnType, right: ReturnType }

export class IsFunction implements Statement {
    public expresion: Statement;
    public type: Primitive;
    public line: number;
    public column: number;

    constructor(expresion: Statement, type: Primitive, line: number, column: number,){
        this.expresion = expresion;
        this.type = type;
        this.line = line;
        this.column = column;
    }

    interpret(tree: Tree, table: Environment) {
        return undefined;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        let expresion: ReturnType;
        try {
            expresion = this.expresion.getValue(tree, table);
        } catch (err){
            tree.errors.push(err as Exception); throw err;
        }

        if (expresion.type === this.type){
            return new ReturnType(Primitive.BOOL, true);
        } else {
            return new ReturnType(Primitive.BOOL, false);
        }

    }

    // TODO
    getCST(): Node {
        let node: Node = new Node("Arithmetic Expression");
        /*
        if (this.leftExp !== undefined){
            node.addChildsNode(this.leftExp.getCST());
        }
        node.addChild(this.operator.toString());
        node.addChildsNode(this.rightExp.getCST());
        */
        return node;
    }

    getAST(): Node {
        let node: Node = new Node("IS");
        node.addChildsNode(this.expresion.getAST());
        node.addChild("IS");
        node.addChild(this.type.toUpperCase());
        return node;
    }


}
