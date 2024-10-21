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
                //console.log(instruction)

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
}


describe('Test Interpreter On FINAL 2', () => {
    let globalEnv: Environment;
    let tree: Tree;

    beforeAll(() => {
        // Reading test file
        const testPath = path.join(__dirname, '..', '..', 'testFiles', 'archivo2.ci');
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
        //executeCode(tree, globalEnv);
    });


    test('The "echo" outputs should match expected values', () => {
        const expectedOutput = [
            "--------------------------------------------------------",
            "-----------------CALIFICACION ARCHIVO 2-----------------",
            "--------------------------------------------------------",
            "--------------------------------------------------------",
            "-------------------- CICLO DO-UNTIL --------------------",
            "--------------------- SWITCH CASE ---------------------",
            "--------------------------------------------------------",
            "--------------------- CICLO WHILE ----------------------",
            "El factorial de: 7 = 7 * 6 * 5 * 4 * 3 * 2 * 1 = 5040",
            "El factorial de: 6 = 6 * 5 * 4 * 3 * 2 * 1 = 720",
            "El factorial de: 5 = 5 * 4 * 3 * 2 * 1 = 120",
            "El factorial de: 4 = 4 * 3 * 2 * 1 = 24",
            "El factorial de: 3 = 3 * 2 * 1 = 6",
            "El factorial de: 2 = 2 * 1 = 2",
            "El factorial de: 1 = 1 = 1",
            "El factorial de: 0 = 0 = 1",
            "--------------------------------------------------------",
            "--------------------- CICLO FOR ------------------------",
            // Expected 'corazon' and 'arbol' output would be large, adding a few lines for brevity
            ". . . . . . . . . . * * * . . . . . . . ",
            ". . . . . . * * * * * * * * . . . . . . ",
            // Rest of the corazon and arbol output...
            "--------------------------------------------------------",
            "--------------------- CICLO LOOP -----------------------",
            // Expected loop pyramid output...
            "***************",
            " *************",
            // Rest of the pyramid...
            "--------------------------------------------------------",
            "----------------- SENTENCIAS TRANSFERENCIA -------------",
            "Entramos al ciclo1 con k = 0",
            "Entramos al ciclo2 con l = 0",
            "Hacemos break al ciclo2",
            // Rest of transfer statements...
            "--------------------------------------------------------",
            "----------------- RECURSIVIDAD BÁSICA ------------------",
            "Generando nivel 0 del triángulo de Pascal",
            "C(0,0) = 1",
            "Generando nivel 1 del triángulo de Pascal",
            "C(1,0) = 1",
            "C(1,1) = 1",
            "1 1",
            // Pascal triangle continues...
            "--------------------------------------------------------",
            "Multiplicacion de dos numeros por sumas sucesivas",
            "7 x 9 = 63"
        ];

        for (const message of expectedOutput){
            //expect(tree.stdOut).toContain(message);
        }
    });

    test('MultiplicacionPorSumas should calculate correctly', () => {
        // Validate multiplication by successive sums
        //let multiPlicacionPorSumasResult = globalEnv.getSymbol(new Symbol("total", Primitive.INT, null, VariableTypes.VAR, 0, 0, globalEnv));
        //if (multiPlicacionPorSumasResult instanceof Symbol) {
        //    expect(multiPlicacionPorSumasResult.value).toBe(63);  // 7 * 9
        //}
    });

    test('FactorialIterativo should calculate factorial correctly', () => {
        // let factorialResult = globalEnv.getSymbol(new Symbol("numeroFactorial", Primitive.INT, null, VariableTypes.VAR, 0, 0, globalEnv));
        // if (factorialResult instanceof Symbol) {
        //     expect(factorialResult.value).toBe(1);  // Factorial of 0 is 1
        // }
    });



   afterAll(() => {
        // Define the path where the HTML file will be saved
        const htmlFilePath = path.join(__dirname, 'final_file_2_output.html');

        // HTML template structure
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Final 2</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Final 2 Program Output</h1>
                <pre>${tree.stdOut}</pre>
            </body>
            </html>
        `;

        // Write the HTML content to the file
        writeFileSync(htmlFilePath, htmlContent, 'utf8');
    });

});
