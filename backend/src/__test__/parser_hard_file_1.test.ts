import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { CompInterpreterParser, CompInterpreterLexer, environments } from '../analizador/gramatica';
import Environment, { createGlobalEnv } from '../analizador/herramientas/entornos';
import Tree from '../analizador/herramientas/arbol';
import { Primitive, VariableTypes } from '../analizador/herramientas/tipos';
import Symbol from '../analizador/herramientas/simbolos';
import { CallFunc } from '../analizador/expresiones/callFunc';
import { PrimitiveVal } from '../analizador/expresiones/primitives';
import ReturnType from '../analizador/herramientas/returnType';
import { CodeBlock } from '../analizador/instrucciones/codeBlock';


// Helper to store all symbols first (variable declarations, function declarations, etc.)
function storeAllSymbols(tree: Tree, globalEnv: Environment) {
    for (const instruction of tree.instructions) {
        let value;
        try {
            if (!(instruction instanceof CallFunc)) {
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
            console.log(tree.errors);

            throw err;  // Fail the test if there's an error
        }
    }
}

// Helper to execute the code after symbols have been stored
function executeCode(tree: Tree, globalEnv: Environment) {
    for (const instruction of tree.instructions) {
        let value;
        try {
            value = instruction.interpret(tree, globalEnv);
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
}


describe('Test Interpreter On Medium File 1', () => {
    let globalEnv: Environment;
    let tree: Tree;

    beforeAll(() => {
        // Reading test file
        const testPath = path.join(__dirname, '..', '..', 'testFiles', 'archivoCalif3.test.ci');
        const data = readFileSync(testPath, 'utf8');

        // Lexical analysis
        const lexer = new CompInterpreterLexer();
        let any = lexer.setInput(data, {});
        let tokens: Array<any> = [];

        while (!any.done) {
            let token = any.next();
            if (typeof token === "string") {
                tokens.push(token);
            }
        }

        // Parsing the data
        const parser = new CompInterpreterParser();
        let instructions: Array<any> = parser.parse(data);

        // Create global environment and tree
        globalEnv = createGlobalEnv();
        tree = new Tree(instructions, globalEnv);

        storeAllSymbols(tree, globalEnv);
        executeCode(tree, globalEnv)
    });


    test('The "echo" outputs should match expected values', () => {
        const expectedOutput = [
            "----------- Opcion 1 -----------",
            "El numero 49 es impar",
            "----------- Opcion 2 -----------",
            "* * * * * * * * * * * * * * . . . . . . . . ",
            "* * * * * * * * * * * * . . . . . . . . ",
            "* * * * * * * * * * * . . . . . . . . ",
            // (This pattern continues based on the heart shape calculation)
            "----------- Opcion 3 -----------",
            // Output for the hourglass figure here
            "----------- Opcion 4 -----------",
            // Output for the letter "A" figure here
            "----------- Opcion Default -----------",
            // Output for the pyramid shape here
            "Esta vez si sale compi1 :D",
            "Ustedes pueden :3"
        ];


        for (const message of expectedOutput){
            expect(tree.stdOut).toContain(message);
        }
    });


    /** *******************************BOORAR**************************** */

   afterAll(() => {
        // Define the path where the HTML file will be saved
        const htmlFilePath = path.join(__dirname, 'hard_file_1_output.html');

        // HTML template structure
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Hard 1</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Hard 1 Program Output</h1>
                <pre>${tree.stdOut}</pre>
            </body>
            </html>
        `;

        // Write the HTML content to the file
        writeFileSync(htmlFilePath, htmlContent, 'utf8');
    });

});
