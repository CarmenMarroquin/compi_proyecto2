import { Node, Statement } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Any, Functions, Primitive, VariableTypes } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import Symbol from "../herramientas/simbolos";
import { Func, NativeFunc } from "../instrucciones/functions";
import { If } from "../instrucciones/if";

export interface VarArgs {
    id: string, val: Statement
}


export class CallFunc implements Statement {
    public id: string;
    public argExpr: Array<VarArgs>;
    public line: number;
    public column: number;

    constructor(id: string, argExpr: Array<VarArgs>, line: number, column: number,){
        this.id = id;
        this.argExpr = argExpr;
        this.line = line;
        this.column = column;
    }

    interpret(tree: Tree, table: Environment) {
        try {
            return this.getValue(tree, table)
        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        let symbol: Symbol;
        try{
            symbol = table.getSymbol(new Symbol(this.id, Primitive.NULL, null, Functions.FUNC, this.line, this.column, table));
            if (symbol.environment.name === "Global" && symbol.id === "mcd"){
                //console.log(symbol.value);
            }
        } catch(err){
            console.log("ERROR")
            throw err;
        }

        const calledFunc: Func = symbol.value;

        // Verify quantity of parameters
        //if (this.argExpr.length !== 0 && calledFunc.args.length !== 0){
        if (this.argExpr.length > calledFunc.args.length){
            let err = new Exception('Sementic', `${this.id} expected ${calledFunc.args.length} parameters, ${this.argExpr.length} given`, this.line, this.column, table.name);
            tree.errors.push(err);
            throw err;
        } else if (this.argExpr.length === 0 && calledFunc.args.length === 0){
        } else if (this.argExpr.length <= calledFunc.args.length){
        } else {
            // TODO modify this if there is an error calling a function
            if (this.argExpr.length !== 0){
                let err = new Exception('Sementic', `++++${this.id} expected ${this.argExpr.length} parameters, ${calledFunc.args.length} given`, this.line, this.column, table.name);
                tree.errors.push(err);
                throw err;
            } else {
                let err = new Exception('Sementic', `----${this.id} expected ${0} parameters, ${calledFunc.args.length} given`, this.line, this.column, table.name);
                tree.errors.push(err);
                throw err;
            }
        }

        // create a new environment for this function
        const funcEnv: Environment = new Environment(table, `func_env_${this.id}`);
        tree.envs.push(funcEnv);

        // FIRST SAVE ALL VARIABLES FROM THE CALLED FUNCTION
        for (const calledFuncArg of calledFunc.args){
            try {
                let defaultArgValue: ReturnType | null;
                if (calledFuncArg.deft !== undefined){
                    defaultArgValue = calledFuncArg.deft.getValue(tree, funcEnv);
                } else {
                    defaultArgValue = null;
                }
                const toSaveSym = new Symbol(calledFuncArg.id.toLowerCase(), calledFuncArg.type, defaultArgValue, VariableTypes.VAR, this.line, this.column, funcEnv);
                funcEnv.setSymbol(toSaveSym);
            } catch(err){
                tree.errors.push(err as Exception); throw err;
            }
        }

        // NOW REASIGN THE VARIABLES FROM THE RECEIVED ARGUMENTS
        for (const receivedArg of this.argExpr){
            try {
                type CalledFuncArgs = { id: string, type: Primitive, deft?: Statement }
                const matchingArg: Array<CalledFuncArgs> = (calledFunc.args.filter((argument) => argument.id === receivedArg.id) as Array<CalledFuncArgs>);
                if (matchingArg.length === 1){
                    const receivedValue: ReturnType = receivedArg.val.getValue(tree, table);
                    //console.log(receivedValue);
                    const updateSymbol = new Symbol(receivedArg.id.toLowerCase(), receivedValue.type, receivedValue.value, VariableTypes.VAR, this.line, this.column, funcEnv);
                    funcEnv.updateSymbol(updateSymbol);
                } else {
                    throw new Exception("Semantic", `No argument matching ${receivedArg.id} in function call ${this.id}`, this.line, this.column, funcEnv.name);
                }
            } catch(err){
                tree.errors.push(err as Exception); throw err;
            }
        }


        // LOOP THROUGH CALLEDFUNC ARGS TO VERIFY IF ALL PARAMETERS WHERE SET
        for (const calledFuncArg of calledFunc.args){
            try {
                let tempSym: Symbol = new Symbol(calledFuncArg.id, calledFuncArg.type, null, VariableTypes.VAR, 0, 0, funcEnv);
                tempSym = funcEnv.getSymbol(tempSym);
                if (tempSym.value === null){
                    console.log(this);
                    console.log(tempSym);
                    throw new Exception("Semantic", `No argument where suplied for variable ${tempSym.id} at ${this.id}`, this.line, this.column, funcEnv.name);
                }
            } catch(err){
                tree.errors.push(err as Exception); throw err;
            }
        }

        // if (funcEnv.name === "func_env_pascal"){
        //     debugger;
        // }

        // NOW EXECUTE CODE
        let ret: ReturnType | void;
        if (symbol.type === Functions.NATIVE_FN){
            // to get the value from the Native func function
            try{
                ret = calledFunc.getValue(tree, funcEnv);
            } catch(err){
                tree.errors.push(err as Exception); throw err;
            }
        } else {
            try {
                ret = calledFunc.block.interpret(tree, funcEnv);
            } catch (err) {
                tree.errors.push(err as Exception); throw err;
            }
        }

        // a native function always returns a value too
        if (symbol.type === Functions.FUNC){
            if (ret instanceof ReturnType){
                if (ret.value.type === calledFunc.retType){
                    return ret.value;
                } else {
                    let err = new Exception("Type Error", `Variable of type '${ret.type}' can't return a '${calledFunc.retType}'`, this.line, this.column, funcEnv.name);
                    tree.errors.push(err);
                    throw err;
                }
            }
            if (ret === undefined){
                // here i return a type error because the function return indefined
                    let err = new Exception("Type Error", `Variable of type 'undefined' can't return a '${calledFunc.retType}'`, this.line, this.column, funcEnv.name);
                    tree.errors.push(err);
                    throw err;
            }
        }

        if (symbol.type === Functions.NATIVE_FN){
            if (ret instanceof ReturnType){
                return ret;
            }
            if (ret === undefined){
                // here i return a type error because the function return indefined
                    let err = new Exception("Type Error", `Variable of type 'undefined' can't return a '${calledFunc.retType}'`, this.line, this.column, funcEnv.name);
                    tree.errors.push(err);
                    throw err;
            }
        }

        if (symbol.type === Functions.METHOD){
            if (ret instanceof Exception){
                return new ReturnType(Primitive.NULL, ret);
            }
            if (ret instanceof ReturnType){
                if (ret.value !== null){
                    let err = new Exception("Semantic", `A METHOD can't return a value`, this.line, this.column, funcEnv.name);
                    tree.errors.push(err);
                    throw err;
                }
            }
        }
        // default to return this
        return new ReturnType(Primitive.NULL, null);
    }

    getCST(): Node {
        return new Node("Node");
    }

    getAST(): Node {
        let node = new Node("CALL FUNCTION");
        node.addChild(this.id);
        if (this.argExpr !== undefined){
            let argsNode = new Node("ARGUMENTS");
            for (let arg of this.argExpr) {
                argsNode.addChildsNode(arg.val.getAST());
            }
            node.addChildsNode(argsNode);
        }
        return node;
    }
}


