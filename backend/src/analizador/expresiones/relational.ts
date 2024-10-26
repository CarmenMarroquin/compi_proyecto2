import { Node, Statement } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Primitive, RelationalOperator } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import { array, boolean } from "joi";

type Ret = { left: ReturnType, right: ReturnType }


export class Relational implements Statement {
    public leftExp: Statement;
    public rightExp: Statement;
    public operator: RelationalOperator;
    public line: number;
    public column: number;

    constructor(leftExp: Statement, operator: RelationalOperator, rightExp: Statement, line: number, column: number,){
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
            case RelationalOperator.EQ: {
                try {
                    return this._equal_operation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case RelationalOperator.NEQ: {
                try {
                    return this._neq_operation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case RelationalOperator.GREATER: {
                try {
                    return this._greater_operation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case RelationalOperator.GEQ: {
                try {
                    return this._geq_operation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case RelationalOperator.LESS: {
                try {
                    return this._less_operation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case RelationalOperator.LEQ: {
                try {
                    return this._leq_operation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
        }
    }

    _neq_operation(table:Environment, tree: Tree): ReturnType {
        let leftResult: ReturnType;
        let rightResult: ReturnType;
        try {
            leftResult = this.leftExp.getValue(tree, table);
            rightResult = this.rightExp.getValue(tree, table);
            this._typeCheckOperator(leftResult, rightResult, table);
        } catch (err){
            tree.errors.push(err as Exception); throw err;
        }

        let results: Ret = this._transformAsciiToNumber(leftResult, rightResult);
        leftResult = results.left; rightResult = results.right;

        return new ReturnType(
            Primitive.BOOL,
            leftResult.value !== rightResult.value
        );
    }


    _equal_operation(table: Environment, tree: Tree): ReturnType {
        let leftResult: ReturnType;
        let rightResult: ReturnType;
        try {
            leftResult = this.leftExp.getValue(tree, table);
            rightResult = this.rightExp.getValue(tree, table);
            this._typeCheckOperator(leftResult, rightResult, table);
        } catch (err){
            tree.errors.push(err as Exception); throw err;
        }

        let results: Ret = this._transformAsciiToNumber(leftResult, rightResult);
        leftResult = results.left; rightResult = results.right;

        //console.error(`LEFT: {type: ${leftResult.type}, val: ${leftResult.value}}, RIGHT: {type: ${rightResult.type}, val: ${rightResult.value}}`);

        return new ReturnType(
            Primitive.BOOL,
            leftResult.value === rightResult.value
        );
    }

    _greater_operation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
            this._typeCheckOperator(results.left, results.right, table);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;


        results = this._transformAsciiToNumber(leftResult, rightResult);
        leftResult = results.left; rightResult = results.right;
        return new ReturnType(
            Primitive.BOOL,
            leftResult.value > rightResult.value
        );
    }

    _less_operation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
            this._typeCheckOperator(results.left, results.right, table);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        results = this._transformAsciiToNumber(leftResult, rightResult);
        leftResult = results.left; rightResult = results.right;

        return new ReturnType(
            Primitive.BOOL,
            leftResult.value < rightResult.value
        );
    }


    _geq_operation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
            this._typeCheckOperator(results.left, results.right, table);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        results = this._transformAsciiToNumber(leftResult, rightResult);
        leftResult = results.left; rightResult = results.right;

        return new ReturnType(
            Primitive.BOOL,
            leftResult.value >= rightResult.value
        );
    }

    _leq_operation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
            this._typeCheckOperator(results.left, results.right, table);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        results = this._transformAsciiToNumber(leftResult, rightResult);
        leftResult = results.left; rightResult = results.right;

        return new ReturnType(
            Primitive.BOOL,
            leftResult.value <= rightResult.value
        );
    }

    _testOperators(table: Environment, tree: Tree): Ret {
        let leftResult: ReturnType;
        let rightResult: ReturnType;
        try {
            leftResult = this.leftExp.getValue(tree, table);
            rightResult = this.rightExp.getValue(tree, table);
            this._typeCheckOperator(leftResult, rightResult, table);
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

    _transformAsciiToNumber(left: ReturnType, right: ReturnType): Ret{
        if (left.type === Primitive.CHAR && (right.type === Primitive.INT || right.type === Primitive.DOUBLE)){
            left.type = Primitive.INT
            left.value = (left.value as string).charCodeAt(0);
            return {"left": left, "right": right}
        } else if (right.type === Primitive.CHAR && (left.type === Primitive.INT || left.type === Primitive.DOUBLE)){
            right.type = Primitive.INT
            right.value = (left.value as string).charCodeAt(0);
            return {"left": left, "right": right}
        } else {
            return {"left": left, "right": right};
        }
    }

    _typeCheckOperator(leftResult: ReturnType, rightResult: ReturnType, table: Environment){
        let err = new Exception("Semantic", `Variables of types ${leftResult.type}: ${leftResult.value} and ${rightResult.type}: ${rightResult.value}`, this.line, this.column, table.name);
        switch (leftResult.type){
            case Primitive.INT: {
                if (rightResult.type === Primitive.BOOL){
                    throw err;
                } else if (rightResult.type === Primitive.STRING){
                    throw err;
                }
                break;
            }
            case Primitive.DOUBLE: {
                if (rightResult.type === Primitive.BOOL){
                    throw err;
                } else if (rightResult.type === Primitive.STRING){
                    throw err;
                }
                break;
            }
            case Primitive.BOOL: {
                if (rightResult.type === Primitive.INT){
                    throw err;
                } else if (rightResult.type === Primitive.DOUBLE){
                    throw err;
                } else if (rightResult.type === Primitive.CHAR){
                    throw err;
                } else if (rightResult.type === Primitive.STRING){
                    throw err;
                }
                break;
            }
            case Primitive.CHAR: {
                if (rightResult.type === Primitive.BOOL){
                    throw err;
                } else if (rightResult.type === Primitive.STRING){
                    throw err;
                }
                break;
            }
        }
    }


    getCST(): Node {
        let node: Node = new Node("Relational Expression");
        node.addChildsNode(this.leftExp.getCST());
        node.addChild(this.operator.toString());
        node.addChildsNode(this.rightExp.getCST());
        return node;
    }

    getAST(): Node {
        let node: Node = new Node(this.operator);
        node.addChildsNode(this.leftExp.getAST());
        node.addChildsNode(this.rightExp.getAST());
        return node;
    }
}
