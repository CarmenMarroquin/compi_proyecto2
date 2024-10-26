import { Node, Statement} from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { LogicalOperator, Primitive } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";

type Ret = { left: ReturnType, right: ReturnType }

export class Logical implements Statement {
    public leftExp: Statement | undefined;
    public rightExp: Statement;
    public operator: LogicalOperator;
    public line: number;
    public column: number;

    constructor(leftExp: Statement | undefined, operator: LogicalOperator, rightExp: Statement, line: number, column: number,){
        this.leftExp = leftExp;
        this.operator = operator;
        this.rightExp = rightExp;
        this.line = line;
        this.column = column;
    }

    interpret(tree: Tree, table: Environment) {
        return undefined;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        switch(this.operator){
            case LogicalOperator.AND: {
                try {
                    return this._andOperation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case LogicalOperator.OR: {
                try {
                    return this._orOperation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case LogicalOperator.NOT: {
                try {
                    return this._notOperation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
        }
    }
    // I should change this but I'm a lazy bastard so IDC

    _andOperation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        if (leftResult.type === Primitive.BOOL && rightResult.type === Primitive.BOOL){
            return new ReturnType(Primitive.BOOL, leftResult.value && rightResult.value);
        }

        throw new Exception("Type Error", `"&&" not supported between instances of ${leftResult.type} and ${rightResult.type}`, this.line, this.column, table.name);
    }

    _orOperation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        if (leftResult.type === Primitive.BOOL && rightResult.type === Primitive.BOOL){
            return new ReturnType(Primitive.BOOL, leftResult.value || rightResult.value);
        }

        throw new Exception("Type Error", `"||" not supported between instances of ${leftResult.type} and ${rightResult.type}`, this.line, this.column, table.name);
    }

    _notOperation(table: Environment, tree: Tree): ReturnType {
        let rightResult: ReturnType = this.rightExp.getValue(tree, table);

        if (rightResult.type === Primitive.BOOL){
            return new ReturnType(Primitive.BOOL, !rightResult.value);
        }

        throw new Exception("Type Error", `"!" not supported at instance of ${rightResult.type}`, this.line, this.column, table.name);
    }

    _testOperators(table: Environment, tree: Tree): Ret {
        let leftResult: ReturnType;
        let rightResult: ReturnType;
        try {
            // @ts-ignore
            leftResult = this.leftExp.getValue(tree, table);
            rightResult = this.rightExp.getValue(tree, table);
        } catch (err){
            throw err;
        }


        if (rightResult.value instanceof ReturnType){
            rightResult.value = rightResult.value.value
        }
        if (leftResult.value instanceof ReturnType){
            leftResult.value = leftResult.value.value
        }

        return { left: leftResult, right: rightResult };
    }

    getCST(): Node {
        return new Node("Node");
    }

    getAST(): Node {
        let node: Node = new Node(this.operator.toString());
        if (this.leftExp !== undefined){
            node.addChildsNode(this.leftExp.getAST());
        }
        node.addChildsNode(this.rightExp.getAST());
        return node;
    }


}
