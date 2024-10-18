import Symbol from "./simbolos";
import { Exception } from "../errores";
import { Any, Functions, Id, Primitive, ValueType } from "./tipos";
/*
import { Func, Function, NativeFunc } from "../instrucciones/function";
import { CodeBlock } from "../instructions/codeBlock";
import { Return } from "../instructions/return";
import { CallVar } from "../expressions/callVar";
*/
import ReturnType from "./returnType";


export function createGlobalEnv() {
    const env = new Environment();
    // Define a native builtin functions
    env.setSymbol(new Symbol(
        "lower",
        Functions.NATIVE_FN,
        new NativeFunc(
            "lower",
            [{id: "str", type: Primitive.STRING}],
            (strVar) =>{
                strVar.value = (strVar.value as string).toLowerCase();
                return strVar;
            },
            0,0
        ), 0, 0, env
    ));

    env.setSymbol(new Symbol(
        "upper",
        Functions.NATIVE_FN,
        new NativeFunc(
            "upper",
            [{id: "str", type: Primitive.STRING}],

            (strVar) =>{
                strVar.value = (strVar.value as string).toUpperCase();
                return strVar;
            },
            0,0
        ), 0, 0, env
    ));

    // TODO round function
    /*
    env.setSymbol(new Symbol(
        "round",
        Functions.NATIVE_FN,
        new NativeFunc(
            "round",
            [{id: "num", type: Primitive.INT}],

            (numVar) =>{
                numVar.value = (numVar.value as double).toUpperCase();
                return strVar;
            },
            0,0
        ), 0, 0, env
    ));
    */



    env.setSymbol(new Symbol(
        "len",
        Functions.NATIVE_FN,
        new NativeFunc(
            "len",
            [{id: "@str", type: Primitive.STRING}],
            (strVar) =>{
                strVar.value = (strVar.value as string).length;
                strVar.type = Primitive.INT;
                return strVar;
            },
            0,0
        ), 0, 0, env
    ));

    env.setSymbol(new Symbol(
        "round",
        Functions.NATIVE_FN,
        new NativeFunc(
            "round",
            [{id: "num", type: Primitive.DOUBLE}],
            (num) =>{
                let newNum: number = Number(num.value);
                num.value = Math.round(newNum);
                num.type = Primitive.DOUBLE;
                return num;
            },
            0,0
        ), 0, 0, env
    ));

    // verify this
    env.setSymbol(new Symbol(
        "truncate",
        Functions.NATIVE_FN,
        new NativeFunc(
            "truncate",
            [{id: "num", type: Primitive.DOUBLE}],
            (num) =>{
                let newNum: number = Number(num.value);
                num.value = Math.trunc(newNum);
                num.type = Primitive.DOUBLE;
                return num;
            },
            0,0
        ), 0, 0, env
    ));

    return env;
}



export default class Environment {
    public name: string;
    public parent?: Environment;
    public table: Map<string, Symbol>;

    constructor(parent?: Environment, name: string = "Global") {
        const global = parent ? true : false;
        this.parent = parent;
        this.table = new Map();
        this.name = name;
    }

    public getGlobalEnv(): Environment{
        if (this.parent !== undefined)
            return this.parent.getGlobalEnv();
        return this;
    }

    // LOGIC OPERATIONS
    public setSymbol(symbol: Symbol){
        try {
            let env: Environment = this.resolveSymbol(symbol);
            throw new Exception("Semantic", `Variable name ${symbol.id} already defined on scope`, symbol.row, symbol.column, this.name);
        } catch(err){
            symbol.id = symbol.id.toLowerCase();
            symbol.environment = this;
            this.table.set(symbol.id, symbol);
        }
    }

    public updateSymbol(symbol: Symbol){
        const env = this.resolveSymbol(symbol);

        let envVar = env.table.get(symbol.id);

        if (envVar !== undefined){
            if (envVar.type === symbol.type) {
                envVar.value = symbol.value;
                return;
            }

            throw new Exception("Semantic", `The variable: ${symbol.id} isn't type: ${symbol.type}`, symbol.row, symbol.column, this.name);
        }
    }

    public getSymbol(symbol: Symbol): Symbol{
        const env = this.resolveSymbol(symbol);

        return env.table.get(symbol.id) as Symbol;
    }

    public resolveSymbol(symbol: Symbol): Environment {
        symbol.id = symbol.id.toLowerCase();

        if (this.table.has(symbol.id)) {
            return this;
        }

        if (this.parent == undefined) {
            throw new Exception("Semantic", `Cannot resolve '${symbol.id}' as it does not exist.`, symbol.row, symbol.column, this.name);
        }

        return this.parent.resolveSymbol(symbol);
    }
}
