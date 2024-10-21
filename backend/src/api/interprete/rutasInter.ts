import express from "express";
import { CompInterpreterLexer, CompInterpreterParser } from "../../analizador/gramatica";
import { createGlobalEnv } from "../../analizador/herramientas/entornos";
import Tree from "../../analizador/herramientas/arbol";
import { CallFunc } from "../../analizador/expresiones/callFunc";

const router = express.Router();


router.get('/test', (req, res) => {
    res.status(200).json({"message": "Okay"});
})

router.post('/interpretar', (req, res) => {

    const { error, content } = req.body;
    if (error){
        res.status(400).send('Invalid Json Structure');
        return;
    }

    const data: string = content;

    const lexer = new CompInterpreterLexer();
    let any = lexer.setInput(data, {});

    let tokens: Array<any> = [];

    while (!any.done){
        let token = any.next();
        if (typeof token === "string"){
            tokens.push(token)
        }
    }


    // Parsing the data
    const parser = new CompInterpreterParser();
    let instructions: Array<any> = parser.parse(data);

    // Create global environment and tree

    const globalEnv = createGlobalEnv();
    const tree = new Tree(instructions, globalEnv);

    let len = 0;
    try {
        len = tree.instructions.length;
    } catch(err){}

    for (const instruction of tree.instructions) {
        let value;
        try {
            if (!(instruction instanceof CallFunc)) {
                value = instruction.interpret(tree, globalEnv);
                //console.log(instruction)

            }
        } catch (err) {
            len = 0;
            tree.instructions = [];
        }
    }

    for (const instruction of tree.instructions) {
        let value;
        try {
            if (instruction instanceof CallFunc){
                value = instruction.interpret(tree, globalEnv);
            }
        } catch (err) {
            console.log("----------------------------------ERROR VAL----------------------------------")
            console.error(err);
            console.log("----------------------------------VALUE RETURNED----------------------------------")
            console.log(value);
            console.log("----------------------------------GLOBAL ENV----------------------------------")
            console.log(globalEnv);
            console.log("----------------------------------ERRORS FROM TREE----------------------------------")
            console.error(tree.errors);
            throw err;  // Fail the test if there's an error
        }
    }
    })

export { router };
