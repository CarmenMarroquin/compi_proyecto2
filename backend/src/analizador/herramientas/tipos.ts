import { Vector } from "../expresiones/vector";

export enum Primitive {
    INT = "int",
    DOUBLE = "double",
    BOOL = "bool",
    CHAR = "char",
    STRING = "string",
    NULL = "null"
}

export enum VariableTypes {
    VAR = "let",
    CONST = "const",
    ARRAY = "array"
}

export enum ArithmeticOperator {
    PLUS = "+",
    MINUS = "-",
    MULT = "*",
    DIV = "/",
    POWER = "^",
    ROOT = "$",
    MOD = "%",
    UMINUS = "- ",
}

export enum RelationalOperator {
    EQ = "=",
    NEQ = "!=",
    LESS = "<",
    GREATER = ">",
    LEQ = "<=",
    GEQ = ">="
}

export enum TernaryOperator {
    IF = "if"
}

export enum LogicalOperator {
    AND = "&&",
    OR = "||",
    NOT = "!"
}

export enum TransferOp {
    RETURN = "return",
    BREAK = "break",
    CONTINUE = "continue"
}

export enum Functions {
    FUNC = "func",
    METHOD = "method",
    NATIVE_FN = "native_fn"
}

export enum Id {
    ID = "id",
    RESERVED = "reserved"
}

export enum Any {
    ANY = "anyvar"
}


export type Undefined = undefined;


export type ValueType = Primitive | Functions | TransferOp | Id | Any | TernaryOperator | Vector | VariableTypes.ARRAY;
