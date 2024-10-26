import { Node, Statement } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Primitive } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";


export class Cast implements Statement {
    public expr: Statement;
    public toType: Primitive;
    constructor(expr: Statement, toType: Primitive, public line: number, public column: number){
        this.expr = expr;
        this.toType = toType;
    }

    interpret(tree: Tree, table: Environment) {
        return undefined;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        try {
            let res: ReturnType = this.expr.getValue(tree, table);
            let newRet = new ReturnType(Primitive.NULL, undefined);
            try {
                switch(this.toType){
                    case Primitive.DOUBLE: {
                        if (res.type === Primitive.INT){
                            let temp: string | number = String(res.value);
                            newRet.value = parseFloat(temp);
                            newRet.type = Primitive.DOUBLE;
                            return newRet;
                        } else if (res.type === Primitive.CHAR){
                            let temp: number =res.value.charCodeAt(0);
                            newRet.value = parseFloat(temp.toFixed(1));
                            newRet.type = Primitive.DOUBLE;
                            return newRet;
                        }
                    }
                    case Primitive.INT: {
                        if (res.type === Primitive.DOUBLE){
                            let temp: string | number = String(res.value);
                            newRet.value = parseInt(res.value.toString());
                            newRet.type = Primitive.INT;
                            return newRet;
                        } else if (res.type === Primitive.CHAR){
                            let temp: number = res.value.charCodeAt(0);
                            newRet.value = temp;
                            newRet.type = Primitive.INT;
                            return newRet;
                        }
                    }
                    case Primitive.STRING: {
                        if (res.type === Primitive.INT){
                            newRet.value = String(res.value);
                            newRet.type = Primitive.STRING;
                            return newRet;
                        } else if (res.type === Primitive.DOUBLE){
                            newRet.value = String(res.value);
                            newRet.type = Primitive.STRING;
                            return newRet;
                        }
                    }
                    case Primitive.CHAR: {
                        if (res.type === Primitive.INT){
                            newRet.value = String(String.fromCharCode(res.value));
                            newRet.type = Primitive.CHAR;
                            return newRet;
                        }
                    }
                    default: {
                        throw new Exception("Type Error", `Variable of type ${res.type} cannot be casted to type ${this.toType}`, 0, 0);
                    }
                }

            } catch(err){
                throw new Exception("Type Error", `Variable of type ${res.type} cannot be casted to type ${this.toType}`, 0, 0);
            }
        } catch (err){
            tree.errors.push(err as Exception); throw err;
        }
    }

    getCST(): Node {
        return new Node("Node");
    }

    getAST(): Node {
        let node: Node = new Node("CAST");
        node.addChildsNode(this.expr.getAST());
        node.addChild("AS");
        node.addChild(this.toType.toUpperCase());
        return node;
    }
}
