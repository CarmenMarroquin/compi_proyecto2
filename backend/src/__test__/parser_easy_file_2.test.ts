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


describe('Test Interpreter On Easy File 2', () => {
    let globalEnv: Environment;
    let tree: Tree;

    beforeAll(() => {
        // Reading test file
        const testPath = path.join(__dirname, '..', '..', 'testFiles', 'archivoCalif.test.ci');
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


    test('Arithmetic operations should result in correct values', () => {
        let aritmetica1 = environments[0].getSymbol(new Symbol("aritmetica1", Primitive.NULL, null, VariableTypes.VAR, 0, 0, environments[0]));
        let aritmetica2 = environments[0].getSymbol(new Symbol("aritmetica2", Primitive.NULL, null, VariableTypes.VAR, 0, 0, environments[0]));
        let aritmetica3 = environments[0].getSymbol(new Symbol("aritmetica3", Primitive.NULL, null, VariableTypes.VAR, 0, 0, environments[0]));

        if (aritmetica1 instanceof Symbol) {
            expect(aritmetica1.value).toBe(61);
            expect(aritmetica1.type).toBe(Primitive.DOUBLE);
        }

        if (aritmetica2 instanceof Symbol) {
            expect(aritmetica2.value).toBeCloseTo(56.34, 2);
            expect(aritmetica2.type).toBe(Primitive.DOUBLE);
        }

        if (aritmetica3 instanceof Symbol) {
            expect(aritmetica3.value).toBe(-46);
            expect(aritmetica3.type).toBe(Primitive.DOUBLE);
        }
    });

    test('Relational operations should result in correct values', () => {
        let relacional1 = environments[0].getSymbol(new Symbol("relacional1", Primitive.NULL, null, VariableTypes.VAR, 0, 0, environments[0]));
        let relacional2 = environments[0].getSymbol(new Symbol("relacional2", Primitive.NULL, null, VariableTypes.VAR, 0, 0, environments[0]));
        let relacional3 = environments[0].getSymbol(new Symbol("relacional3", Primitive.NULL, null, VariableTypes.VAR, 0, 0, environments[0]));
        let relacional4 = environments[0].getSymbol(new Symbol("relacional4", Primitive.NULL, null, VariableTypes.VAR, 0, 0, environments[0]));

        if (relacional1 instanceof Symbol) {
            expect(relacional1.value).toBe(true);
            expect(relacional1.type).toBe(Primitive.BOOL);
        }

        if (relacional2 instanceof Symbol) {
            expect(relacional2.value).toBe(false);
            expect(relacional2.type).toBe(Primitive.BOOL);
        }

        if (relacional3 instanceof Symbol) {
            expect(relacional3.value).toBe(false);
            expect(relacional3.type).toBe(Primitive.BOOL);
        }

        if (relacional4 instanceof Symbol) {
            expect(relacional4.value).toBe(true);
            expect(relacional4.type).toBe(Primitive.BOOL);
        }
    });

    test('Logical operations should result in correct values', () => {
        let logica1 = environments[0].getSymbol(new Symbol("logica1", Primitive.NULL, null, VariableTypes.VAR, 0, 0, environments[0]));
        let logica2 = environments[0].getSymbol(new Symbol("logica2", Primitive.NULL, null, VariableTypes.VAR, 0, 0, environments[0]));
        let logica3 = environments[0].getSymbol(new Symbol("logica3", Primitive.NULL, null, VariableTypes.VAR, 0, 0, environments[0]));

        if (logica1 instanceof Symbol) {
            expect(logica1.value).toBe(true);
            expect(logica1.type).toBe(Primitive.BOOL);
        }

        if (logica2 instanceof Symbol) {
            expect(logica2.value).toBe(true);
            expect(logica2.type).toBe(Primitive.BOOL);
        }

        if (logica3 instanceof Symbol) {
            expect(logica3.value).toBe(false);
            expect(logica3.type).toBe(Primitive.BOOL);
        }
    });

    test('The "echo" outputs should match expected values', () => {
        const expectedOutput = [
            "Calificacion Fase 1",
            "'Operaciones aritmeticas'",
            "Aritmetica1 true",
            "Aritmetica2 true",
            "Aritmetica3 true",
            "",
            "Operaciones relacionales",
            "Relacional1 true",
            "Relacional2 false",
            "Relacional3 false",
            "Relacional4 true",
            "\\Operaciones logicas\\",
            "Logica1 true",
            "Logica2 true",
            "Logica3 false",
            "",
            "Valor por defecto false"
        ];

        for (const message of expectedOutput){
            expect(tree.stdOut).toContain(message);
        }
    });


   afterAll(() => {
        // Define the path where the HTML file will be saved
        const htmlFilePath = path.join(__dirname, 'easy_file_2_output.html');

        // HTML template structure
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Easy 2</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Easy 2 Program Output</h1>
                <pre>${tree.stdOut}</pre>
            </body>
            </html>
        `;

        // Write the HTML content to the file
        writeFileSync(htmlFilePath, htmlContent, 'utf8');
    });

});
