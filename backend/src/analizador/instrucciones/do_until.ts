import { Statement, Node } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Primitive, TransferOp } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import { CodeBlock } from "./codeBlock";
import Symbol from "../herramientas/simbolos";


export class DoUntil implements Statement {
    public block: CodeBlock;
    public condition: Statement;
    public line: number;
    public column: number;

    constructor(block: CodeBlock, condition: Statement, line: number, column: number){
        this.block = block;
        this.condition = condition;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        let flag: ReturnType;
        /*
        try {
            flag = this.condition.getValue(tree, table)
            console.log("AQUII");
        } catch(err){
            tree.errors.push(err as Exception);
            throw err;
        }
        */

        const newWhileEnv: Environment = new Environment(table, "do_while_env");
        tree.envs.push(newWhileEnv);

        let res: ReturnType | void = undefined;
        do {
            if (this.block instanceof CodeBlock){
                try{
                    res = this.block.interpret(tree, newWhileEnv);
                } catch(err){
                    tree.errors.push(err as Exception);
                    throw err;
                }
            }

            try {
                flag = this.condition.getValue(tree, newWhileEnv);
            } catch(err){
                tree.errors.push(err as Exception);
                throw err;
            }

            // To handle control words
            if (res instanceof ReturnType){
                if (res.type === TransferOp.BREAK){
                    break;
                }
                if (res.type === TransferOp.CONTINUE){
                    continue;
                }
                if (res.type === TransferOp.RETURN){
                    return res;
                }
            }
        } while (!flag.value);

        return undefined;
    }

    getCST(): Node {

        return new Node("Node");
    }

    getAST(): Node {
        let node: Node = new Node("WHILE");

        node.addChildsNode(this.condition.getAST());

        // doing this to not add the BLOCK node
        for (let item of this.block.instructions){
            node.addChildsNode(item.getAST());
        }
        //insTrue.addChildsNode(this.block.getAST());

        return node;
    }




}
