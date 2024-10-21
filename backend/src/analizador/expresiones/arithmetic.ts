import { Node, Statement } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { ArithmeticOperator, Primitive, RelationalOperator } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import Symbol from "../herramientas/simbolos";
import { PrimitiveVal } from "./primitives";

type Ret = { left: ReturnType, right: ReturnType }

export class Arithmetic implements Statement {
    public leftExp: Statement | undefined;
    public rightExp: Statement;
    public operator: ArithmeticOperator;
    public line: number;
    public column: number;

    constructor(leftExp: Statement | undefined, operator: ArithmeticOperator, rightExp: Statement, line: number, column: number,){
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
            case ArithmeticOperator.PLUS: {
                try {
                    return this._plusOperation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case ArithmeticOperator.MINUS: {
                try {
                    return this._minusOperation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case ArithmeticOperator.MULT: {
                try {
                    return this._multOperation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case ArithmeticOperator.DIV: {
                try {
                    return this._divOperation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case ArithmeticOperator.MOD: {
                try {
                    return this._modOperation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case ArithmeticOperator.POWER: {
                try {
                    return this._powerOperation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }

            }
            case ArithmeticOperator.ROOT: {
                try {
                    return this._rootOperation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
            case ArithmeticOperator.UMINUS: {
                try {
                    return this._uminusOperation(table, tree);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
        }
    }

    _plusOperation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        if (leftResult.type === Primitive.INT){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.INT, leftResult.value + rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value + rightResult.value);
                }
                case Primitive.BOOL: {
                    return new ReturnType(Primitive.INT, leftResult.value + rightResult.value);
                }
                case Primitive.CHAR: {
                    return new ReturnType(Primitive.INT, leftResult.value + rightResult.value.charCodeAt(0));
                }
                case Primitive.STRING: {
                    return new ReturnType(Primitive.STRING, leftResult.value + rightResult.value);
                }
            }
        }
        if (leftResult.type === Primitive.DOUBLE){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value + rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value + rightResult.value);
                }
                case Primitive.BOOL: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value + rightResult.value);
                }
                case Primitive.CHAR: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value + rightResult.value.charCodeAt(0));
                }
                case Primitive.STRING: {
                    return new ReturnType(Primitive.STRING, leftResult.value + rightResult.value);
                }
            }
        }
        if (leftResult.type === Primitive.BOOL){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.INT, leftResult.value + rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value + rightResult.value);
                }
                case Primitive.STRING: {
                    return new ReturnType(Primitive.STRING, leftResult.value + rightResult.value);
                }
            }
        }
        if (leftResult.type === Primitive.CHAR){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.INT, leftResult.value.charCodeAt(0) + rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value.charCodeAt(0) + rightResult.value);
                }
                case Primitive.CHAR: {
                    return new ReturnType(Primitive.STRING, leftResult.value + rightResult.value);
                }
                case Primitive.STRING: {
                    return new ReturnType(Primitive.STRING, leftResult.value + rightResult.value);
                }
            }
        }
        if (leftResult.type === Primitive.STRING){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.STRING, leftResult.value + rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.STRING, leftResult.value + rightResult.value);
                }
                case Primitive.BOOL: {
                    return new ReturnType(Primitive.STRING, leftResult.value + rightResult.value);
                }
                case Primitive.CHAR: {
                    return new ReturnType(Primitive.STRING, leftResult.value + rightResult.value);
                }
                case Primitive.STRING: {
                    return new ReturnType(Primitive.STRING, leftResult.value + rightResult.value);
                }
            }
        }


        throw new Exception("Type Error", `"+" not supported between instances of ${leftResult.type} and ${rightResult.type}`, this.line, this.column, table.name);
    }

    _minusOperation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        if (leftResult.type === Primitive.INT){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.INT, leftResult.value - rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value - rightResult.value);
                }
                case Primitive.BOOL: {
                    return new ReturnType(Primitive.INT, leftResult.value - rightResult.value);
                }
                case Primitive.CHAR: {
                    return new ReturnType(Primitive.INT, leftResult.value - rightResult.value.charCodeAt(0));
                }
            }
        }
        if (leftResult.type === Primitive.DOUBLE){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value - rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value - rightResult.value);
                }
                case Primitive.BOOL: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value - rightResult.value);
                }
                case Primitive.CHAR: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value - rightResult.value.charCodeAt(0));
                }
            }
        }
        if (leftResult.type === Primitive.BOOL){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.INT, leftResult.value - rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value - rightResult.value);
                }
            }
        }
        if (leftResult.type === Primitive.CHAR){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.INT, leftResult.value.charCodeAt(0) - rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value.charCodeAt(0) - rightResult.value);
                }
            }
        }


        throw new Exception("Type Error", `"-" not supported between instances of ${leftResult.type} and ${rightResult.type}`, this.line, this.column, table.name);
    }


    _multOperation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        if (leftResult.type === Primitive.INT){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.INT, leftResult.value * rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value * rightResult.value);
                }
                case Primitive.CHAR: {
                    return new ReturnType(Primitive.INT, leftResult.value * rightResult.value.charCodeAt(0));
                }
            }
        }
        if (leftResult.type === Primitive.DOUBLE){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value * rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value * rightResult.value);
                }
                case Primitive.CHAR: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value * rightResult.value.charCodeAt(0));
                }
            }
        }
        if (leftResult.type === Primitive.CHAR){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.INT, leftResult.value.charCodeAt(0) * rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value.charCodeAt(0) * rightResult.value);
                }
            }
        }

        throw new Exception("Type Error", `"*" not supported between instances of ${leftResult.type} and ${rightResult.type}`, this.line, this.column, table.name);
    }

    _divOperation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        if (leftResult.type === Primitive.INT){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value / rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value / rightResult.value);
                }
                case Primitive.CHAR: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value / rightResult.value.charCodeAt(0));
                }
            }
        }
        if (leftResult.type === Primitive.DOUBLE){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value / rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value / rightResult.value);
                }
                case Primitive.CHAR: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value / rightResult.value.charCodeAt(0));
                }
            }
        }
        if (leftResult.type === Primitive.CHAR){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value.charCodeAt(0) / rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value.charCodeAt(0) / rightResult.value);
                }
            }
        }

        throw new Exception("Type Error", `"/" not supported between instances of ${leftResult.type} and ${rightResult.type}`, this.line, this.column, table.name);
    }

    _powerOperation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        if (leftResult.type === Primitive.INT){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.INT, leftResult.value ** rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value ** rightResult.value);
                }
            }
        }
        if (leftResult.type === Primitive.DOUBLE){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value ** rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value ** rightResult.value);
                }
            }
        }

        throw new Exception("Type Error", `"^" not supported between instances of ${leftResult.type} and ${rightResult.type}`, this.line, this.column, table.name);
    }


    _rootOperation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        if (leftResult.type === Primitive.INT){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value ** (1 / rightResult.value));
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value ** (1 / rightResult.value));
                }
            }
        }
        if (leftResult.type === Primitive.DOUBLE){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value ** (1 / rightResult.value));
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value ** (1 / rightResult.value));
                }
            }
        }

        throw new Exception("Type Error", `"$" not supported between instances of ${leftResult.type} and ${rightResult.type}`, this.line, this.column, table.name);
    }


    _modOperation(table: Environment, tree: Tree): ReturnType {
        let results: Ret;
        try{
            results = this._testOperators(table, tree);
        } catch(err){
            throw err;
        }
        let leftResult: ReturnType = results.left;
        let rightResult: ReturnType = results.right;

        if (leftResult.type === Primitive.INT){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value % rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value % rightResult.value);
                }
            }
        }
        if (leftResult.type === Primitive.DOUBLE){
            switch (rightResult.type){
                case Primitive.INT: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value % rightResult.value);
                }
                case Primitive.DOUBLE: {
                    return new ReturnType(Primitive.DOUBLE, leftResult.value % rightResult.value);
                }
            }
        }

        throw new Exception("Type Error", `"%" not supported between instances of ${leftResult.type} and ${rightResult.type}`, this.line, this.column, table.name);
    }

    _uminusOperation(table: Environment, tree: Tree): ReturnType {
        let rightResult: ReturnType = this.rightExp.getValue(tree, table);
        if (rightResult.value instanceof Exception){
            throw rightResult.value;
        }

        if (rightResult.type === Primitive.INT){
            return new ReturnType(Primitive.INT, rightResult.value * -1);
        }
        if (rightResult.type === Primitive.DOUBLE){
            return new ReturnType(Primitive.DOUBLE, rightResult.value * -1.0);
        }

        throw new Exception("Type Error", `"-" not supported at instance of ${rightResult.type}`, this.line, this.column, table.name);
    }




    _testOperators(table: Environment, tree: Tree): Ret {
        // @ts-ignore
        let leftResult: ReturnType = this.leftExp.getValue(tree, table);
        if (leftResult.value instanceof Exception) {
            throw new Exception(leftResult.value.type, leftResult.value.description, this.line, leftResult.value.column, table.name);
        }
        let rightResult: ReturnType = this.rightExp.getValue(tree, table);
        if (rightResult.value instanceof Exception) {
            throw new Exception(rightResult.value.type, rightResult.value.description, this.line, rightResult.value.column, table.name);
        }

        return { left: leftResult, right: rightResult };
    }



    getCST(): Node {
        let node: Node = new Node("Arithmetic Expression");
        if (this.leftExp !== undefined){
            node.addChildsNode(this.leftExp.getCST());
        }
        node.addChild(this.operator.toString());
        node.addChildsNode(this.rightExp.getCST());
        return node;
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
