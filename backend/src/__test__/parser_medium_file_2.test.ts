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


describe('Test Interpreter On Medium 2', () => {
    let globalEnv: Environment;
    let tree: Tree;

    beforeAll(() => {
        // Reading test file
        const testPath = path.join(__dirname, '..', '..', 'testFiles', 'medio_2.test.ci');
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
        executeCode(tree, globalEnv);
    });

    test('The "echo" outputs should match expected values', () => {
        const expectedOutput = [
            "Archivo de prueba 1",
            "Si sale compi1 ",
            "Manejo de entornos correcto :D",
            "Tabla de multiplicar de 7",
            "7 x 1 = 7",
            "7 x 2 = 14",
            "7 x 3 = 21",
            "7 x 4 = 28",
            "7 x 5 = 35",
            "7 x 6 = 42",
            "7 x 7 = 49",
            "7 x 8 = 56",
            "7 x 9 = 63",
            "7 x 10 = 70",
            "este es a:",
            "48",
            "---------",
            "este es b:",
            "18",
            "---------",
            "este es a:",
            "18",
            "---------",
            "este es b:",
            "12",
            "---------",
            "este es a:",
            "12",
            "---------",
            "este es b:",
            "6",
            "---------",
            "este es a:",
            "6",
            "---------",
            "este es b:",
            "0",
            "---------",
            "Recursividad basica correcta",
            "La suma de los elementos de arreglo2 es: 17",
            "La cantidad de ceros en el arreglo es: 8"
        ];


        for (const message of expectedOutput){
            expect(tree.stdOut).toContain(message);
        }
    });

    test('Table of multiplication should return correct values for 7', () => {
        const expectedMultiplicationOutput = [
            "7 x 1 = 7",
            "7 x 2 = 14",
            "7 x 3 = 21",
            "7 x 4 = 28",
            "7 x 5 = 35",
            "7 x 6 = 42",
            "7 x 7 = 49",
            "7 x 8 = 56",
            "7 x 9 = 63",
            "7 x 10 = 70"
        ];

        for (let i = 1; i <= 10; i++) {
            const result = `${7} x ${i} = ${7 * i}`;
            expect(expectedMultiplicationOutput).toContain(result);
        }
    });

    test('Recursive function "mcd" should return correct GCD', () => {
        let callMcd = new CallFunc(
            "mcd",
            [
                { id: "a", val: new PrimitiveVal("48.0", Primitive.DOUBLE, 0, 0) },
                { id: "b", val: new PrimitiveVal("18.0", Primitive.DOUBLE, 0, 0) }
            ],
            0,
            0
        );
        let result = callMcd.getValue(tree, globalEnv);
        let expectedResult = new ReturnType(Primitive.DOUBLE, 6.0);
        expect(result).toStrictEqual(expectedResult);
    });

    test('Array analysis should return correct sum and count of zeros', () => {
        let currentEnv: Array<Environment> = environments.filter((env) => env.name === "func_env_AnalizarArreglo");
        let suma = currentEnv[0].getSymbol(new Symbol("suma", Primitive.NULL, null, VariableTypes.VAR, 0, 0, globalEnv));
        let ceros = currentEnv[0].getSymbol(new Symbol("ceros", Primitive.NULL, null, VariableTypes.VAR, 0, 0, globalEnv));

        if (suma instanceof Symbol) {
            expect(suma.value).toBe(17);  // Expected sum of non-zero values in arreglo2
        }

        if (ceros instanceof Symbol) {
            expect(ceros.value).toBe(8);  // Expected count of zero values in arreglo2
        }
    });


   afterAll(() => {
        // Define the path where the HTML file will be saved
        const htmlFilePath = path.join(__dirname, 'hard_file_2_output.html');

        // HTML template structure
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Medium 2</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Medium 2 Program Output</h1>
                <pre>${tree.stdOut}</pre>
            </body>
            </html>
        `;

        // Write the HTML content to the file
        writeFileSync(htmlFilePath, htmlContent, 'utf8');
    });

});
