import { Statement, Node } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Primitive } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import { CodeBlock } from "./codeBlock";


export class If implements Statement {
    public condition: Statement;
    public block: CodeBlock;
    public elseBlock: CodeBlock | If | undefined;
    public line: number;
    public column: number;

    constructor(condition: Statement, block: CodeBlock, elseBlock: CodeBlock | If | undefined, line: number, column: number,){
        this.block = block;
        this.elseBlock = elseBlock;
        this.condition = condition;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, undefined);
    }

    // @ts-ignore
    interpret(tree: Tree, table: Environment) {
        let flag: ReturnType;
        try {
            flag = this.condition.getValue(tree, table);
        } catch (err){
            tree.errors.push(err as Exception); throw err;
        }

        const ifEnv: Environment = new Environment(table, "if_env");
        tree.envs.push(ifEnv);
        if (flag.type === Primitive.BOOL){
            if (flag.value === true){
                try{
                    return this.block.interpret(tree, ifEnv);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            } else if(this.elseBlock instanceof CodeBlock || this.elseBlock instanceof If){
                try{
                    return this.elseBlock.interpret(tree, ifEnv);
                } catch(err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
        }
    }

    getCST(): Node {

        return new Node("Node");
    }

    getAST(): Node {
        let node: Node = new Node("IF");
        if (this.condition !== undefined){
            node.addChildsNode(this.condition.getAST());
        }

        let insTrue: Node = new Node("TRUE");
        // doing this to not add the BLOCK node
        for (let item of this.block.instructions){
            insTrue.addChildsNode(item.getAST());
        }
        //insTrue.addChildsNode(this.block.getAST());
        node.addChildsNode(insTrue);

        if (this.elseBlock !== undefined){
            let insFalse: Node = new Node("FALSE");
            if (this.elseBlock instanceof CodeBlock){
                for (let item of this.elseBlock.instructions){
                    insFalse.addChildsNode(item.getAST());
                }
            }             //insFalse.addChildsNode(this.elseBlock.getAST());

            node.addChildsNode(insFalse);
        }
        return node;
    }




}
