import { Statement, Node } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { IncDec, Primitive, TransferOp, VariableTypes } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import { CodeBlock } from "./codeBlock";
import { VarDeclaration } from "./declaration";
import Symbol from "../herramientas/simbolos";
import { Logical } from "../expresiones/logical";
import { SetVar } from "./setVar";
import { IncDecVar } from "./incDec";



export class For implements Statement {
    public variable: VarDeclaration | SetVar;
    public condition: Logical;
    public update: IncDecVar | SetVar;
    public block: CodeBlock;
    public line: number;
    public column: number;

    constructor(variable: VarDeclaration | SetVar, condition: Logical, update: IncDecVar | SetVar, block: CodeBlock, line: number, column: number,){
        this.variable = variable;
        this.condition = condition;
        this.update = update;
        this.block = block;
        this.block.envName = "for_env";
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        const newForEnv: Environment = new Environment(table, "for_env");
        tree.envs.push(newForEnv);

        // Check if variable declaration is valid
        try {
            this.variable.interpret(tree, newForEnv);
        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }

        try {
            let retVal: ReturnType | undefined;
            while (this.condition.getValue(tree, newForEnv)){
                retVal = this.block.interpret(tree, newForEnv);
                this.update.interpret(tree, newForEnv);
                // To handle control words
                if (retVal instanceof ReturnType){
                    if (retVal.type === TransferOp.BREAK){
                        break;
                    }
                    if (retVal.type === TransferOp.CONTINUE){
                        continue;
                    }
                    if (retVal.type === TransferOp.RETURN){
                        return retVal;
                    }
                }
            }

        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }
    }

    // TODO check this
    getCST(): Node {

        return new Node("Node");
    }

    getAST(): Node {
        let node: Node = new Node("FOR");


        let range: Node = new Node("RANGE");
        //range.addChild(this.start.toString());
        //range.addChild(this.end.toString());

        node.addChildsNode(range);

        node.addChildsNode(this.block.getAST());
        // doing this to not add the BLOCK node
        /*
        for (let item of this.block.instructions){
            node.addChildsNode(item.getAST());
        }
        */
        //insTrue.addChildsNode(this.block.getAST());

        return node;
    }




}
