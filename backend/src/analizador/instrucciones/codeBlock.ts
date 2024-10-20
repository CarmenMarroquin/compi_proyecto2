import { Node, Statement } from "../abstract/ast";
import { Exception } from "../errores";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import Tree from "../herramientas/arbol";
import { Primitive, VariableTypes, IncDec, TransferOp, Functions } from "../herramientas/tipos";
import Symbol from "../herramientas/simbolos";
import { Vector } from "../expresiones/vector";



export class CodeBlock implements Statement {
    public instructions: Array<Statement>;
    public envName: string;
    public currentEnv: Environment;
    public symbol: Symbol | undefined;
    public envType: Functions;
    public line;
    public column;

    constructor(instructions: Array<Statement>, line: number, column: number, envName:string = "deft", envType = Functions.METHOD){
        this.instructions = instructions;
        this.envName = envName;
        this.currentEnv = new Environment(undefined, this.envName);
        this.symbol = undefined;
        this.envType = envType;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, null);
    }

    interpret(tree: Tree, table: Environment) {
        // In case want to initiate the new environment with a default symbol
        let retVar: ReturnType | undefined;
        for (let instruction of this.instructions){
            try{
                retVar = instruction.interpret(tree, table);
            } catch(err){
                tree.errors.push(err as Exception);
                throw err
            }

            if (retVar instanceof ReturnType){
                if (retVar.type === TransferOp.BREAK || retVar.type === TransferOp.CONTINUE) {
                    // this operations return  an instance of type ReturnType({TransferOp.BREAK or TransferOp.CONTINUE}, null)
                    return retVar;
                }
                if (retVar.type === TransferOp.RETURN){
                    // this operations return  an instance of type ReturnType(TransferOp.RETURN, ReturnType)
                    return retVar.value;
                }
            }
        }

        if (this.envType === Functions.FUNC){
            let err = new Exception("Semantic", `A Function must return a value`, this.line, this.column, this.envName);
            tree.errors.push(err); throw err;
        }

        return retVar;
    }

    getCST(): Node {

        return new Node("Node");
    }

    getAST(): Node {
        let node: Node = new Node("BLOCK")
        for (let inst of this.instructions){
            node.addChildsNode(inst.getAST());
        }
        return node;
    }
}
