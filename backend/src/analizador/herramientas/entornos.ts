import Symbol from "./simbolos";
import { Exception } from "../errores";
import { Any, Functions, Id, Primitive, ValueType, VariableTypes } from "./tipos";
import { Func, Function, NativeFunc } from "../instrucciones/functions";
import { Statement } from "../abstract/ast";
import { CodeBlock } from "../instrucciones/codeBlock";
import { Return } from "../instrucciones/transferOp";
import { CallVar } from "../expresiones/callVar";
import ReturnType from "./returnType";
import { Vector } from "../expresiones/vector";
import { PrimitiveVal } from "../expresiones/primitives";


type FuncArgs = { id: string, type: Primitive, deft?: Statement }
export function createGlobalEnv() {
    const env = new Environment();
    // Define a native builtin functions
    // TODO DO NATIVE FUNCTIONS
    env.setSymbol(new Symbol(
        "lower",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.STRING,
            "lower",
            [{id: "arg", type: Primitive.STRING}],
            (strVar) =>{
                strVar.value = (strVar.value as string).toLowerCase();
                return strVar;
            },
            0,0
        ), Functions.NATIVE_FN,0, 0, env
    ));

    env.setSymbol(new Symbol(
        "upper",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.STRING,
            "upper",
            [{id: "arg", type: Primitive.STRING}],
            (strVar) =>{
                strVar.value = (strVar.value as string).toUpperCase();
                return strVar;
            },
            0,0
        ), Functions.NATIVE_FN ,0, 0, env
    ));

    env.setSymbol(new Symbol(
        "round",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.INT,
            "round",
            [{id: "arg", type: Primitive.DOUBLE}],
            (arg) =>{
                arg.value = Math.round((arg.value as number));
                arg.type = Primitive.INT;
                return arg;
            },
            0,0
        ), Functions.NATIVE_FN ,0, 0, env
    ));

    env.setSymbol(new Symbol(
        "len",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.INT,
            "len",
            [{id: "arg", type: Any.ANY}],
            (arg) =>{
                debugger;
                if (arg.type === Primitive.STRING){
                    arg.value = (arg.value as string).length;
                    arg.type = Primitive.INT;
                } else if (arg.value instanceof Vector){
                    arg.value = (arg.value as Vector).length;
                    arg.type = Primitive.INT;
                }
                return arg;
            },
            0,0
        ), Functions.NATIVE_FN ,0, 0, env
    ));

    env.setSymbol(new Symbol(
        "truncate",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.INT,
            "truncate",
            [{id: "arg", type: Primitive.DOUBLE}],
            (arg) =>{
                arg.value = Math.trunc((arg.value as number));
                arg.type = Primitive.INT;
                return arg;
            },
            0,0
        ), Functions.NATIVE_FN ,0, 0, env
    ));


    env.setSymbol(new Symbol(
        "tostring",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.STRING,
            "tostring",
            [{id: "arg", type: Primitive.DOUBLE}],
            (arg) =>{
                arg.value = String(arg.value);
                arg.type = Primitive.STRING;
                return arg;
            },
            0,0
        ), Functions.NATIVE_FN ,0, 0, env
    ));


    env.setSymbol(new Symbol(
        "tochararray",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.CHAR,
            "tochararray",
            [{id: "arg", type: Primitive.STRING}],
            (arg) =>{
                const newArr = (arg.value as string).split("");
                const primitiveVals = newArr.map(val => new PrimitiveVal(val, Primitive.CHAR, 0, 0));
                const returnedVals = newArr.map(val => new ReturnType(Primitive.CHAR, val));
                let newVector = new Vector(newArr.length, Primitive.CHAR, primitiveVals);
                newVector.interpretedValues = returnedVals;
                arg.value = newVector;
                arg.type = VariableTypes.ARRAY;
                return arg;
            },
            0,0
        ), Functions.NATIVE_FN ,0, 0, env
    ));


    env.setSymbol(new Symbol(
        "reverse",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.STRING,
            "reverse",
            [{id: "arg", type: Any.ANY}],
            (arg) =>{
                const argAsVector = arg.value as Vector;
                argAsVector.values = argAsVector.values.reverse();
                argAsVector.interpretedValues = argAsVector.interpretedValues.reverse();
                arg.value = argAsVector
                arg.type = VariableTypes.ARRAY;
                return arg;
            },
            0,0
        ), Functions.NATIVE_FN ,0, 0, env
    ));


    env.setSymbol(new Symbol(
        "max",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.INT,
            "max",
            [{id: "arg", type: Any.ANY}],
            (arg) =>{
                const argAsVector = arg.value as Vector;
                if (argAsVector.dataType === Primitive.INT || argAsVector.dataType === Primitive.DOUBLE || argAsVector.dataType === Primitive.BOOL){
                    return new ReturnType(
                        argAsVector.dataType,
                        argAsVector.interpretedValues.reduce((prev, current) => {
                            return (prev.value > current.value) ? prev.value : current.value;
                        })
                    );
                } else if (argAsVector.dataType === Primitive.CHAR){
                    return new ReturnType(
                        argAsVector.dataType,
                        argAsVector.interpretedValues.reduce((prev, current) => {
                            return ((prev.value as string).charCodeAt(0) > (current.value as string).charCodeAt(0)) ? prev.value : current.value;
                        })
                    );
                } else if (argAsVector.dataType === Primitive.STRING){
                    return new ReturnType(
                        argAsVector.dataType,
                        argAsVector.interpretedValues.reduce((prev, current) => {
                            return (prev.value < current.value) ? prev.value : current.value;
                        })
                    );
                }
                return arg;
            },
            0,0
        ), Functions.NATIVE_FN ,0, 0, env
    ));


    env.setSymbol(new Symbol(
        "min",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.INT,
            "min",
            [{id: "arg", type: Any.ANY}],
            (arg) =>{
                const argAsVector = arg.value as Vector;
                if (argAsVector.dataType === Primitive.INT || argAsVector.dataType === Primitive.DOUBLE || argAsVector.dataType === Primitive.BOOL){
                    return new ReturnType(
                        argAsVector.dataType,
                        argAsVector.interpretedValues.reduce((prev, current) => {
                            return (prev.value < current.value) ? prev.value : current.value;
                        })
                    );
                } else if (argAsVector.dataType === Primitive.CHAR){
                    return new ReturnType(
                        argAsVector.dataType,
                        argAsVector.interpretedValues.reduce((prev, current) => {
                            return ((prev.value as string).charCodeAt(0) < (current.value as string).charCodeAt(0)) ? prev.value : current.value;
                        })
                    );
                } else if (argAsVector.dataType === Primitive.STRING){
                    return new ReturnType(
                        argAsVector.dataType,
                        argAsVector.interpretedValues.reduce((prev, current) => {
                            return (prev.value > current.value) ? prev.value : current.value;
                        })
                    );
                }

                return arg;
            },
            0,0
        ), Functions.NATIVE_FN ,0, 0, env
    ));


    env.setSymbol(new Symbol(
        "sum",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.INT,
            "sum",
            [{id: "arg", type: Any.ANY}],
            (arg) =>{
                const argAsVector = arg.value as Vector;
                if (argAsVector.dataType === Primitive.INT || argAsVector.dataType === Primitive.DOUBLE){
                    return new ReturnType(
                        argAsVector.dataType,
                        argAsVector.interpretedValues.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)
                    );
                } else if (argAsVector.dataType === Primitive.BOOL){
                    return new ReturnType(
                        Primitive.INT,
                        argAsVector.interpretedValues.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)
                    );
                }
                else if (argAsVector.dataType === Primitive.CHAR){
                    return new ReturnType(
                        Primitive.INT,
                        argAsVector.interpretedValues.reduce((accumulator, currentValue) => accumulator + (currentValue.value as string).charCodeAt(0), 0)
                    );
                } else if (argAsVector.dataType === Primitive.STRING){
                    return new ReturnType(
                        argAsVector.dataType,
                        argAsVector.interpretedValues.reduce((accumulator, currentValue) => accumulator + currentValue.value, "")
                    );
                }
                return arg;
            },
            0,0
        ), Functions.NATIVE_FN ,0, 0, env
    ));


    env.setSymbol(new Symbol(
        "average",
        Functions.NATIVE_FN,
        new NativeFunc(
            Primitive.DOUBLE,
            "average",
            [{id: "arg", type: Any.ANY}],
            (arg) =>{
                const argAsVector = arg.value as Vector;
                if (argAsVector.dataType === Primitive.INT || argAsVector.dataType === Primitive.DOUBLE || argAsVector.dataType === Primitive.BOOL){
                    const sum = argAsVector.interpretedValues.reduce((accumulator, currentValue) => accumulator + currentValue.value, 0);
                    return new ReturnType(
                        Primitive.DOUBLE,
                        sum / argAsVector.length
                    );
                } else if (argAsVector.dataType === Primitive.CHAR){
                    const sum = argAsVector.interpretedValues.reduce((accumulator, currentValue) => accumulator + (currentValue.value as string).charCodeAt(0), 0);
                    return new ReturnType(
                        Primitive.INT,
                        sum/argAsVector.length
                    );
                } else {
                    throw new Exception("Type Error", `Cannot calculate average of ${argAsVector.dataType}`, 0, 0, "global");
                }
            },
            0,0
        ), Functions.NATIVE_FN ,0, 0, env
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
            } else if (envVar.type === Any.ANY){
                envVar.value = symbol.value
                envVar.type = symbol.type;
                envVar.symType = symbol.symType;
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
