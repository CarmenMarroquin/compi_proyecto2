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


describe('Test Interpreter On FINAL 3', () => {
    let globalEnv: Environment;
    let tree: Tree;

    beforeAll(() => {
        // Reading test file
        const testPath = path.join(__dirname, '..', '..', 'testFiles', 'archivo3.ci');
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

    /*
    test('The "echo" outputs should match expected values', () => {
        const expectedOutput = [
            "--------------------------------------------------------",
            "-----------------CALIFICACION ARCHIVO 2-----------------",
            "--------------------------------------------------------",
            "--------------------------------------------------------",
            "----------------- VECTOR 1 DIMENSION -------------------",
            "Vector original: [100 50 1 150 70 25 33 0 81 11 5 9 7 77 57 44 23 10 167 2024 ]",
            "Vector ordenado: [0 1 5 7 9 10 11 23 25 33 44 50 57 70 77 81 100 150 167 2024 ]",
            "--------------------------------------------------------",
            "----------------- VECTOR 2 DIMENSION -------------------",
            "Prediccion para [1, 0, 0]: 1",
            "--------------------------------------------------------",
            "----------------------- CASTEOS ------------------------",
            "int_to_double: 2024.0",
            "double_to_int: 61",
            "int_to_string: 2024",
            "int_to_char: F",
            "double_to_string: 61.1",
            "char_to_int: 82",
            "char_to_double: 74.0",
            "--------------------------------------------------------",
            // More expected outputs from other sections (native operations, recursion, etc.)
        ];

        for (const message of expectedOutput){
            expect(tree.stdOut).toContain(message);
        }
    });

    test('Vector sorting (insertionSort) works correctly', () => {
        let sortedVector = globalEnv.getSymbol(new Symbol("vectorEntero", Primitive.INT, null, VariableTypes.VAR, 0, 0, globalEnv));
        if (sortedVector instanceof Symbol) {
            expect(sortedVector.value).toEqual([0, 1, 5, 7, 9, 10, 11, 23, 25, 33, 44, 50, 57, 70, 77, 81, 100, 150, 167, 2024]);
        }
    });

    test('Perceptron prediction works as expected', () => {
        let prediction = globalEnv.getSymbol(new Symbol("prediccion", Primitive.INT, null, VariableTypes.VAR, 0, 0, globalEnv));
        if (prediction instanceof Symbol) {
            expect(prediction.value).toBe(1);  // Expected prediction for [1, 0, 0]
        }
    });

    test('Casting operations work correctly', () => {
        let intToDouble = globalEnv.getSymbol(new Symbol("int_to_double", Primitive.DOUBLE, null, VariableTypes.VAR, 0, 0, globalEnv));
        let doubleToInt = globalEnv.getSymbol(new Symbol("double_to_int", Primitive.INT, null, VariableTypes.VAR, 0, 0, globalEnv));
        let intToString = globalEnv.getSymbol(new Symbol("int_to_string", Primitive.STRING, null, VariableTypes.VAR, 0, 0, globalEnv));
        let intToChar = globalEnv.getSymbol(new Symbol("int_to_char", Primitive.CHAR, null, VariableTypes.VAR, 0, 0, globalEnv));
        let charToInt = globalEnv.getSymbol(new Symbol("char_to_int", Primitive.INT, null, VariableTypes.VAR, 0, 0, globalEnv));

        if (intToDouble instanceof Symbol) {
            expect(intToDouble.value).toBe(2024.0);
        }
        if (doubleToInt instanceof Symbol) {
            expect(doubleToInt.value).toBe(61);
        }
        if (intToString instanceof Symbol) {
            expect(intToString.value).toBe("2024");
        }
        if (intToChar instanceof Symbol) {
            expect(intToChar.value).toBe('F');
        }
        if (charToInt instanceof Symbol) {
            expect(charToInt.value).toBe(82);
        }
    });

    test('Fibonacci and recursive functions work correctly', () => {
        let fibonacciResult = globalEnv.getSymbol(new Symbol("valor_fibonacci", Primitive.INT, null, VariableTypes.VAR, 0, 0, globalEnv));
        let parResult = globalEnv.getSymbol(new Symbol("valor_par_impar", Primitive.INT, null, VariableTypes.VAR, 0, 0, globalEnv));

        if (fibonacciResult instanceof Symbol) {
            expect(fibonacciResult.value).toBe(6765);  // Fibonacci of 20
        }

        if (parResult instanceof Symbol) {
            expect(parResult.value).toBe(70);  // Number 70 is even
        }
    });
*/



   afterAll(() => {
        // Define the path where the HTML file will be saved
        const htmlFilePath = path.join(__dirname, 'final_file_3_output.html');

        // HTML template structure
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Final 3</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Final 3 Program Output</h1>
                <pre></pre>
            </body>
            </html>
        `;

        // Write the HTML content to the file
        writeFileSync(htmlFilePath, htmlContent, 'utf8');
    });

});
