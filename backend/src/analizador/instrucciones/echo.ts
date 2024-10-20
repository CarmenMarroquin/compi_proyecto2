import { Statement, Node } from "../abstract/ast";
import Environment from "../herramientas/entornos";
import ReturnType from "../herramientas/returnType";
import { Primitive } from "../herramientas/tipos";
import Tree from "../herramientas/arbol";
import { Exception } from "../errores";
import { PrimitiveVal } from "../expresiones/primitives";


export class Echo implements Statement {
    public args: Statement;
    public line: number;
    public column: number;

    constructor(args: Statement, line: number, column: number,){
        this.args = args;
        this.line = line;
        this.column = column;
    }

    getValue(tree: Tree, table: Environment): ReturnType {
        return new ReturnType(Primitive.NULL, undefined);
    }

    interpret(tree: Tree, table: Environment) {
        let val: ReturnType;
        try {
            val = this.args.getValue(tree, table);
        }catch(err){
            tree.errors.push(err as Exception); throw err;
        }
        val.value = String(val.value);
        val.value = (val.value as string).replace(/\n/g, "</br></br>");
        val.value = (val.value as string).replace(/\"/g, '"');
        val.value = (val.value as string).replace(/\'/g, "'");
        val.value = (val.value as string).replace(/\t/g, "‎    ");
        val.value = (val.value as string).replace(/\\/g, "\\");
        tree.updateStdout(`<pre class="tab4">${val.value}</pre>`);
    }

    getCST(): Node {

        return new Node("Node");
    }

    getAST(): Node {
        let node: Node = new Node("PRINT")
        node.addChildsNode(this.args.getAST());
        return node;
    }
}
