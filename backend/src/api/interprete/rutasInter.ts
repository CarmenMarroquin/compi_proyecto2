import express from "express";
import { clean_errors, CompInterpreterLexer, CompInterpreterParser, lexErrors, synErrors } from "../../analizador/gramatica";
import { createGlobalEnv } from "../../analizador/herramientas/entornos";
import Tree from "../../analizador/herramientas/arbol";
import { CallFunc } from "../../analizador/expresiones/callFunc";
import { SynError } from "../../analizador/errores";
import { Node } from "../../analizador/abstract/ast";

const router = express.Router();


router.get('/test', (req, res) => {
    res.status(200).json({"message": "Okay"});
})

router.post('/interpretar', (req, res) => {
    clean_errors();

    const { error, content } = req.body;
    if (error){
        res.status(400).send('Invalid Json Structure');
        return;
    }

    const data: string = content;

    const lexer = new CompInterpreterLexer();
    let any = lexer.setInput(data, {});

    let tokens: Array<any> = [];

    const returnLexError = false;
    // LEXICAL
    //
    try {
        while (!any.done){
                let token = any.next();
                if (typeof token === "string"){
                    tokens.push(token)
                }
        }
    } catch (err){
        const errors = {
            lex: lexErrors,
            syn: [],
            sem: []
        }

        const response = {
            status: 2,
            content: "ERROR",
            symTable: [],
            ast: "",
            err: errors,
            tokens: tokens
        }

        return res.status(200).json(response);
    }


    // Parsing the data
    const parser = new CompInterpreterParser();
    let instructions: Array<any>;
    try {
        instructions = parser.parse(data);
    } catch(err){

        // @ts-ignore
        //console.log(err.hash)
        // @ts-ignore
        synErrors.push(new SynError(err.hash.loc.first_line, err.hash.loc.first_column, err.hash.token, err.hash.expected));


        const errors = {
            lex: lexErrors,
            syn: synErrors,
            sem: []
        }


        const response = {
            status: 2,
            content: "ERROR",
            symTable: [],
            ast: "",
            err: errors,
            tokens: tokens
        }

        return res.status(200).json(response);
    }

    // Create global environment and tree

    const globalEnv = createGlobalEnv();
    const tree = new Tree(instructions, globalEnv);

    let len = 0;
    try {
        len = tree.instructions.length;
    } catch(err){}


    // SYNTACTIC
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
            len = 0;
            tree.instructions = [];
            console.log(err);
        }
    }


    /*------------------------------------AST---------------------------------*/


    let rootAst: Node = new Node("ROOT");
    let val: Node = new Node("INSTRUCTIONS");

    for (let i = 0; i < len; i++){
        val.addChildsNode(tree.instructions[i].getAST());
    }

    rootAst.addChildsNode(val);


    let ast: string;
    try{
        ast = tree.getDot(rootAst, false);
    } catch(err){
        ast = "";
        console.log("------------------------------------ERROR PARSING AST------------------------------------")
        console.log(err);
    }

    const errors = {
        lex: lexErrors,
        syn: synErrors,
        sem: tree.errors
    }

    let statusCode = 0;
    if (lexErrors.length > 0){
        statusCode = 1;
    } else if (synErrors.length > 0){
        statusCode = 2;
    } else if (tree.errors.length > 0){
        statusCode = 3;
    }

    const response = {
        status: statusCode,
        content: tree.stdOut,
        symTable: tree.getSymbols(),
        ast: ast,
        err: errors,
        tokens: tokens
    }

    res.status(200).json(response);
    });

export { router };
