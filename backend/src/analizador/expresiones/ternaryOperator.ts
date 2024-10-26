import { Node, Statement } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { ArithmeticOperator, Primitive, RelationalOperator } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import Symbol from "../herramientas/simbolos";
import { PrimitiveVal } from "./primitives";

type Ret = { left: ReturnType, right: ReturnType }

export class TernaryOperator implements Statement {
    public condition: Statement;
    public thenValue: Statement;
    public elseValue: Statement;
    public line: number;
    public column: number;

    constructor(condition: Statement, thenValue: Statement, elseValue: Statement, line: number, column: number,){
        this.condition = condition;
        this.thenValue = thenValue;
        this.elseValue = elseValue;
        this.line = line;
        this.column = column;
    }

    interpret(tree: Tree, table: Environment) {
        return undefined;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        let condition: ReturnType;
        let thenValue: ReturnType;
        let elseValue: ReturnType;
        try {
            condition = this.condition.getValue(tree, table);

            if (condition.value){
                return this.thenValue.getValue(tree, table);
            } else {
                return this.elseValue.getValue(tree, table);
            }

        } catch (err){
            tree.errors.push(err as Exception); throw err;
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
        let node: Node = new Node("");
        /*
        if (this.leftExp !== undefined){
            node.addChildsNode(this.leftExp.getAST());
        }
        node.addChildsNode(this.rightExp.getAST());
        */
        return node;
    }


}
