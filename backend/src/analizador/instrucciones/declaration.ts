import { Statement } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Primitive, VariableTypes } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Node } from "../abstract/ast";
import Symbol from "../herramientas/simbolos";
import { Exception } from "../errores";
import { Expression } from "typescript";
import { Vector } from "../expresiones/vector";
import { NewVector } from "../expresiones/newVectores";
import { CallFunc } from "../expresiones/callFunc";


type ExpType = undefined | Statement


export class VarDeclaration implements Statement {
    public vars: string[];
    public dataType: Primitive;
    public expression: ExpType;
    public line: number;
    public column: number;

    constructor(vars: string[], dataType: Primitive, expression: ExpType, line: number, column: number,){
        this.vars = vars;
        this.dataType = dataType;
        this.expression = expression;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        let value: ReturnType;
        let symbols: Symbol[] = [];


        for (const variable of this.vars) {
            let defaultVal: any = null;
            /*
            switch(this.dataType){
                case Primitive.DOUBLE:{
                    defaultVal = 0;
                    break;
                }
                case Primitive.INT: {
                    defaultVal = 0;
                    break;
                }
                case Primitive.BOOL: {
                    defaultVal = false;
                    break;
                }
                case Primitive.CHAR: {
                    defaultVal = '';
                    break;
                }
                case Primitive.STRING: {
                    defaultVal = "";
                }
            }
            */

            symbols.push(new Symbol(variable.toLowerCase(), this.dataType, defaultVal, VariableTypes.VAR, this.line, this.column, table));
        }



        // if the variables has no value it is undefined and stored as it is
        if (this.expression === undefined) {
            for (const symbol of symbols){
                try {
                    table.setSymbol(symbol)
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
        } else {
            try {
                value = this.expression.getValue(tree, table);
            }catch(err){
                tree.errors.push(err as Exception); throw err;
            }

            // TODO verify if this is working as expecte
            for (const symbol of symbols){
                // if the value given and the data type are not the same throw an error
                if (symbol.type !== value.type){
                    let err = new Exception("Semantic", `Type: variable "${symbol.id}" ${value.type} can't be assigned to variable of type ${symbol.type}`, this.line, this.column, table.name);
                    tree.errors.push(err); throw err;
                // if they are the same assign the value of the symmbol to a new value and try to store the symbol
                } else {
                    symbol.value = value.value;
                    try {
                        table.setSymbol(symbol);
                    }catch(err){
                        tree.errors.push(err as Exception); throw err;
                    }
                }
            }
        }
    }

    getCST(): Node {
        let node: Node = new Node("VarDeclaration");

        return new Node("Node");
    }

    getAST(): Node {
        let node: Node = new Node("VAR_DECLARE")
        for (let variable of this.vars){
            node.addChild(variable);
            node.addChild(this.dataType.toUpperCase());
            if (this.expression !== undefined){
                node.addChildsNode(this.expression.getAST());
            }
        }
        return node;
    }
}


export class ConstDeclaration implements Statement {
    public vars: string[];
    public dataType: Primitive;
    public expression: Statement | undefined;
    public line: number;
    public column: number;

    constructor(vars: string[], dataType: Primitive, expression: Statement | undefined, line: number, column: number,){
        this.vars = vars;
        this.dataType = dataType;
        this.expression = expression;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        let value: ReturnType;
        let symbols: Symbol[] = [];


        for (const variable of this.vars) {
            symbols.push(new Symbol(variable.toLowerCase(), this.dataType, null, VariableTypes.CONST, this.line, this.column, table));
        }

        // if the variables has no value it is undefined and stored as it is
        if (this.expression === undefined) {
            for (const symbol of symbols){
                try {
                    table.setSymbol(symbol)
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
        } else {
            try {
                value = this.expression.getValue(tree, table);
            }catch(err){
                tree.errors.push(err as Exception); throw err;
            }

            // TODO verify if this is working as expected
            for (const symbol of symbols){
                // if the value given and the data type are not the same throw an error
                if (symbol.type !== value.type){
                    let err = new Exception("Semantic", `Type: ${value.type} can't be assigned to variable of type ${symbol.type}`, this.line, this.column, table.name);
                    tree.errors.push(err); throw err;
                // if they are the same assign the value of the symmbol to a new value and try to store the symbol
                } else {
                    symbol.value = value.value;
                    try {
                        table.setSymbol(symbol);
                    }catch(err){
                        tree.errors.push(err as Exception); throw err;
                    }
                }
            }
        }
    }

    getCST(): Node {
        let node: Node = new Node("ConstDeclaration");

        return new Node("Node");
    }

    getAST(): Node {

        let node: Node = new Node("CONST_DECLARE")
        for (let variable of this.vars){
            node.addChild(variable);
            node.addChild(this.dataType.toUpperCase());
            if (this.expression !== undefined){
                node.addChildsNode(this.expression.getAST());
            }
        }
        return node;
    }
}


type ValuesTypes = Statement[] | null[] | Vector[];

export class VectorDeclaration implements Statement {
    public id: string;
    public dataType: Primitive;
    public vector: Vector | NewVector | CallFunc;
    public line: number;
    public column: number;

    constructor(id: string, dataType: Primitive, vector: Vector | NewVector | CallFunc, line: number, column: number,){
        this.id = id;
        this.dataType = dataType;
        this.vector = vector;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        if (this.line === 210){
            debugger;
        }
        let value: ReturnType;
        let newSymbol: Symbol;

        newSymbol = new Symbol(this.id.toLowerCase(), this.dataType, null, VariableTypes.ARRAY, this.line, this.column, table);

        if (this.vector instanceof Vector){
            // CHECK if this is an array
            if (this.vector.dataType === VariableTypes.ARRAY){
                // FOR LOOP FOR EVERY VECTOR
                for (const vector of this.vector.values){
                    // IT MOST BE A VECTOR
                    if (vector instanceof Vector){
                        // FOR LOOP FOR EVERY ITEM IN EVERY SUB VECTOR
                        for (const value of vector.values){
                            // STORE VALUE
                            if (!(value instanceof Vector)){
                                try{
                                    vector.interpretedValues.push(value.getValue(tree, table));
                                    newSymbol.value = this.vector;
                                } catch(err){
                                    tree.errors.push(err as Exception); throw err;
                                }
                            }
                        }
                    }
                }
            } else { // IF THIS IS A REGULAR ARRAY OF STATEMENTS
                for (const value of this.vector.values){
                    if (!(value instanceof Vector)){
                        try{
                            this.vector.interpretedValues.push(value.getValue(tree, table));
                            newSymbol.value = this.vector;
                        } catch(err){
                            tree.errors.push(err as Exception); throw err;
                        }
                    }
                }

            }
        }

        if (this.vector instanceof NewVector){
            let result = this.vector.getValue(tree, table);
            newSymbol.value = result.value;
        }

        if (this.vector instanceof CallFunc){
            let result = this.vector.getValue(tree, table);
            newSymbol.value = result.value;
        }

        try {
            table.setSymbol(newSymbol);
        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }
    }

    getCST(): Node {
        let node: Node = new Node("VectorDeclaration");

        return new Node("Node");
    }

    // TODO
    getAST(): Node {
        let node: Node = new Node("VECTOR_DECLARE")
        node.addChild(this.id);
        node.addChild(this.dataType);

        node.addChildsNode(this.vector.getAST());
        return node;
    }
}
