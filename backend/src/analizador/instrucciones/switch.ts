import { Statement, Node } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Primitive, TransferOp, VariableTypes } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import { CodeBlock } from "./codeBlock";
import Symbol from "../herramientas/simbolos";
import { PrimitiveVal } from "../expresiones/primitives";
import { when } from "joi";
import { DoUntil } from "./do_until";
import { If } from "./if";

type SimpleStmts = { when: Statement, then: Statement }
type Case = { cond: Statement, then: CodeBlock }

export class Switch implements Statement {
    public condition: Statement;
    public cases: Array<Case> | undefined;
    public deft: CodeBlock | undefined;
    public line: number;
    public column: number;

    constructor(condition: Statement, cases: Array<Case> | undefined, deft: CodeBlock | undefined, line: number, column: number){
        this.condition = condition;
        this.cases = cases;
        this.deft = deft;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        let value: ReturnType;
        try{
            value = this.condition.getValue(tree, table);
        } catch(err){
            tree.errors.push(err as Exception); throw err;
        }

        const caseEnv: Environment = new Environment(table, "case_env");
        tree.envs.push(caseEnv);
        let thenBlock: ReturnType | undefined = undefined;
        let breakedSwitch: boolean = false;
        let visitedBlock: boolean = false;
        if (this.cases !== undefined){
            for (const caseItem of this.cases){
                try {
                    if (value.value === caseItem.cond.getValue(tree, table).value || visitedBlock){
                        visitedBlock = true;
                        thenBlock = caseItem.then.interpret(tree, caseEnv);
                        //console.log(((caseItem.then.instructions[2] as DoUntil).block.instructions[3] as If).block.instructions[1]);
                        //console.log("BREAKED SWITHC")
                        if (thenBlock instanceof ReturnType){
                            if (thenBlock.type === TransferOp.BREAK){
                                breakedSwitch = true;
                                break;
                            }
                            if (thenBlock.type === TransferOp.CONTINUE) {
                                // this operations return  an instance of type ReturnType({TransferOp.BREAK or TransferOp.CONTINUE}, null)
                                return thenBlock;
                            }
                            if (thenBlock.type === TransferOp.RETURN){
                                // this operations return  an instance of type ReturnType(TransferOp.RETURN, ReturnType)
                                return thenBlock.value;
                            }
                        }
                    }
                } catch (err){
                    tree.errors.push(err as Exception); throw err;
                }
            }
        }
        if (this.deft !== undefined && !breakedSwitch){
            try {
                caseEnv.name = "default_env";
                thenBlock = this.deft.interpret(tree, caseEnv);
                if (thenBlock instanceof ReturnType){
                    if (thenBlock.type === TransferOp.BREAK || thenBlock.type === TransferOp.CONTINUE) {
                        // this operations return  an instance of type ReturnType({TransferOp.BREAK or TransferOp.CONTINUE}, null)
                        return thenBlock;
                    }
                    if (thenBlock.type === TransferOp.RETURN){
                        // this operations return  an instance of type ReturnType(TransferOp.RETURN, ReturnType)
                        return thenBlock.value;
                    }
                }
            } catch (err){
                tree.errors.push(err as Exception); throw err;
            }
        }
    }

    getCST(): Node {

        return new Node("Node");
    }

    // TODO check this ting
    getAST(): Node {
        let node = new Node("SIMPLE CASE");
        /*
        node.addChildsNode(this.condition.getAST());
        for (let cs of this.cases){
            let caseNode = new Node("CASE");
            let whenNode = new Node("WHEN");
            whenNode.addChildsNode(cs.when.getAST());
            let thenNode = new Node("THEN");
            thenNode.addChildsNode(cs.then.getAST());
            caseNode.addChildsNode(whenNode);
            caseNode.addChildsNode(thenNode);
            node.addChildsNode(caseNode);
        }
        let elseNode = new Node("ELSE");
        elseNode.addChildsNode(this.elseVal.getAST());
        node.addChildsNode(elseNode);
        if (this.asVar !== undefined){
            let asNode = new Node("AS");
            asNode.addChild(this.asVar);
            node.addChildsNode(asNode);
        }
        */
        return node;
    }
}

type SearchedStmts = { when: Statement, then: Statement }
