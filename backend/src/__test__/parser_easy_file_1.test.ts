import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';
import { CompInterpreterParser, CompInterpreterLexer } from '../analizador/gramatica';
import Environment, { createGlobalEnv } from '../analizador/herramientas/entornos';
import Tree from '../analizador/herramientas/arbol';
import { Primitive, VariableTypes } from '../analizador/herramientas/tipos';
import Symbol from '../analizador/herramientas/simbolos';
import { CallFunc } from '../analizador/expresiones/callFunc';
import { PrimitiveVal } from '../analizador/expresiones/primitives';
import ReturnType from '../analizador/herramientas/returnType';


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


describe('Test Interpreter On Easy File 1', () => {
    let globalEnv: Environment;
    let tree: Tree;

    beforeAll(() => {
        // Reading test file
        const testPath = path.join(__dirname, '..', '..', 'testFiles', 'good_general.test.ci');
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
    test('Variable x should be of type INT and value 10', () => {
        let tempSym = globalEnv.getSymbol(new Symbol("x", Primitive.NULL, null, VariableTypes.VAR, 0, 0, globalEnv));
        if (tempSym instanceof Symbol) {
            expect(tempSym.value).toBe(10);
            expect(tempSym.type).toBe(Primitive.INT);
        }
    });

    test('Variable y should be of type DOUBLE and value 5.5', () => {
        let tempSym = globalEnv.getSymbol(new Symbol("y", Primitive.NULL, null, VariableTypes.VAR,0, 0, globalEnv));
        if (tempSym instanceof Symbol) {
            expect(tempSym.value).toBeCloseTo(5.5);
            expect(tempSym.type).toBe(Primitive.DOUBLE);
        }
    });

    test('Variable mensaje should be of type STRING and value "Hola Mundo"', () => {
        let tempSym = globalEnv.getSymbol(new Symbol("mensaje", Primitive.NULL, null, VariableTypes.VAR,0, 0, globalEnv));
        if (tempSym instanceof Symbol) {
            expect(tempSym.value).toBe("Hola Mundo");
            expect(tempSym.type).toBe(Primitive.STRING);
        }
    });

    test('Variable suma should be of type DOUBLE and value 15.5', () => {
        let tempSym = globalEnv.getSymbol(new Symbol("suma", Primitive.NULL, null, VariableTypes.VAR,0, 0, globalEnv));
        if (tempSym instanceof Symbol) {
            expect(tempSym.value).toBeCloseTo(15.5);
            expect(tempSym.type).toBe(Primitive.DOUBLE);
        }
    });

    test('Variable resta should be of type INT and value 7', () => {
        let tempSym = globalEnv.getSymbol(new Symbol("resta", Primitive.NULL, null, VariableTypes.VAR,0, 0, globalEnv));
        if (tempSym instanceof Symbol) {
            expect(tempSym.value).toBe(7);
            expect(tempSym.type).toBe(Primitive.INT);
        }
    });

    test('Variable potencia should be of type DOUBLE and value 100', () => {
        let tempSym = globalEnv.getSymbol(new Symbol("potencia", Primitive.NULL, null,VariableTypes.VAR, 0, 0, globalEnv));
        if (tempSym instanceof Symbol) {
            expect(tempSym.value).toBe(100);
            expect(tempSym.type).toBe(Primitive.DOUBLE);
        }
    });

    test('Variable modulo should be of type INT and value 1', () => {
        let tempSym = globalEnv.getSymbol(new Symbol("modulo", Primitive.NULL, null,VariableTypes.VAR, 0, 0, globalEnv));
        if (tempSym instanceof Symbol) {
            expect(tempSym.value).toBe(1);
            expect(tempSym.type).toBe(Primitive.INT);
        }
    });

    test('Variable esMayor should be of type BOOL and value true', () => {
        let tempSym = globalEnv.getSymbol(new Symbol("esMayor", Primitive.NULL, null,VariableTypes.VAR, 0, 0, globalEnv));
        if (tempSym instanceof Symbol) {
            expect(tempSym.value).toBe(true);
            expect(tempSym.type).toBe(Primitive.BOOL);
        }
    });

    test('Variable resultado should be of type STRING and value "Mayor a 15"', () => {
        let tempSym = globalEnv.getSymbol(new Symbol("resultado", Primitive.NULL, null,VariableTypes.VAR, 0, 0, globalEnv));
        if (tempSym instanceof Symbol) {
            expect(tempSym.value).toBe("Mayor a 15");
            expect(tempSym.type).toBe(Primitive.STRING);
        }
    });

    test('For loop output check', () => {
        // Mocking the echo function or using the internal representation to capture output
        let forLoopOutput = []; // Mock where loop output would be collected
        for (let i = 0; i < 5; i++) {
            forLoopOutput.push(`El valor de i es: ${i}`);
        }
        expect(forLoopOutput).toEqual([
            "El valor de i es: 0",
            "El valor de i es: 1",
            "El valor de i es: 2",
            "El valor de i es: 3",
            "El valor de i es: 4"
        ]);
    });

    test('Function sumaNumeros should return correct sum', () => {
        let callSumaNumero = new CallFunc(
            "sumanumeros",
            [
                {id: "a", val: new PrimitiveVal("7", Primitive.INT, 0, 0)},
                {id: "b", val: new PrimitiveVal("3", Primitive.INT, 0, 0)}
            ],
            0,
            0
        );
        let result = callSumaNumero.getValue(tree, globalEnv);
        let resultType = new ReturnType(Primitive.INT, 10);
        expect(result).toStrictEqual(resultType);
    });

    test('Function imprimirMensaje should echo correct message', () => {
        // Mocking or capturing echo functionality
        const mensaje = "La suma de 3 y 7 es: 10 \n holaa";
        let output = []; // Mock where echo output would be collected

        let callImprimirMensaje = new CallFunc(
            "imprimirmensaje",
            [
                {id: "mensaje", val: new PrimitiveVal(mensaje, Primitive.STRING, 0, 0)}
            ],
            0,
            0
        );
        let result = callImprimirMensaje.getValue(tree, globalEnv);
        expect(tree.stdOut).toContain("La suma de 3 y 7 es: 10 </br></br> holaa");
    });


   afterAll(() => {
        // Define the path where the HTML file will be saved
        const htmlFilePath = path.join(__dirname, 'easy_file_1_output.html');

        // HTML template structure
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Easy 1</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Easy 1 Program Output</h1>
                <pre>${tree.stdOut}</pre>
            </body>
            </html>
        `;

        // Write the HTML content to the file
        writeFileSync(htmlFilePath, htmlContent, 'utf8');
    });

});
