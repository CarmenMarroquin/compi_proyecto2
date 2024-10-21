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


describe('Test Interpreter On Hard 2', () => {
    let globalEnv: Environment;
    let tree: Tree;

    beforeAll(() => {
        // Reading test file
        const testPath = path.join(__dirname, '..', '..', 'testFiles', 'dificil_2.test.ci');
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
            "--------------------------------------------------------",
            "------------------ ARCHIVO DIFICIL --------------------",
            "",
            "--------------------------------------------------------",
            "--------------------- RECURSIVA ------------------------",
            "super_recursiva de 10: 55",
            "",
            "--------------------------------------------------------",
            "--------------------- PAR O IMPAR ----------------------",
            "El numero 10 es PAR",
            "El numero 11 es IMPAR"
        ];

        for (const message of expectedOutput){
            expect(tree.stdOut).toContain(message);
        }
    });

    test('Recursive function "super_recursiva" should return correct values', () => {
    // Create a list of test cases with known Fibonacci numbers
    const fibonacciTestCases = [
        { n: 0, expected: 0 },
        { n: 1, expected: 1 },
        { n: 2, expected: 1 },
        { n: 3, expected: 2 },
        { n: 4, expected: 3 },
        { n: 5, expected: 5 },
        { n: 6, expected: 8 },
        { n: 7, expected: 13 },
        { n: 8, expected: 21 },
        { n: 9, expected: 34 },
        { n: 10, expected: 55 }
    ];

    // Iterate over each test case and verify that super_recursiva returns the correct value
    for (const testCase of fibonacciTestCases) {
        let callSuperRecursiva = new CallFunc(
            "super_recursiva",
            [{ id: "n", val: new PrimitiveVal(`${testCase.n}`, Primitive.INT, 0, 0) }],
            0,
            0
        );
        let result = callSuperRecursiva.getValue(tree, globalEnv);
        let expectedResult = new ReturnType(Primitive.INT, testCase.expected);
        expect(result).toStrictEqual(expectedResult);
    }
    });

    test('Even/Odd function "par_o_impar" should return correct values', () => {
        let callParImpar10 = new CallFunc(
            "par_o_impar",
            [{ id: "n", val: new PrimitiveVal("10", Primitive.INT, 0, 0) }],
            0,
            0
        );
        let result10 = callParImpar10.getValue(tree, globalEnv);
        let resultType10 = new ReturnType(Primitive.STRING, "El numero 10 es PAR");
        expect(result10).toStrictEqual(resultType10);

        let callParImpar11 = new CallFunc(
            "par_o_impar",
            [{ id: "n", val: new PrimitiveVal("11", Primitive.INT, 0, 0) }],
            0,
            0
        );
        let result11 = callParImpar11.getValue(tree, globalEnv);
        let resultType11 = new ReturnType(Primitive.STRING, "El numero 11 es IMPAR");
        expect(result11).toStrictEqual(resultType11);
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
                <title>Hard 2</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Hard 2 Program Output</h1>
                <pre>${tree.stdOut}</pre>
            </body>
            </html>
        `;

        // Write the HTML content to the file
        writeFileSync(htmlFilePath, htmlContent, 'utf8');
    });

});
