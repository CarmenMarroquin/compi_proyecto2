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


describe('Test Interpreter On Medium 3', () => {
    let globalEnv: Environment;
    let tree: Tree;

    beforeAll(() => {
        // Reading test file
        const testPath = path.join(__dirname, '..', '..', 'testFiles', 'medio_3.test.ci');
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
            "X es mayor que Y y no es cero",
            "El valor de i es: 0",
            "El valor de i es: 1",
            "El valor de i es: 2",
            "El valor de i es: 3",
            "El valor de i es: 4",
            "La suma de 3 y 7 es: 10"
        ];

        for (const message of expectedOutput){
            expect(tree.stdOut).toContain(message);
        }
    });

    test('Arithmetic operations should result in correct values', () => {
        let suma = globalEnv.getSymbol(new Symbol("suma", Primitive.NULL, null, VariableTypes.VAR, 0, 0, globalEnv));
        let resta = globalEnv.getSymbol(new Symbol("resta", Primitive.NULL, null, VariableTypes.VAR, 0, 0, globalEnv));
        let potencia = globalEnv.getSymbol(new Symbol("potencia", Primitive.NULL, null, VariableTypes.VAR, 0, 0, globalEnv));
        let modulo = globalEnv.getSymbol(new Symbol("modulo", Primitive.NULL, null, VariableTypes.VAR, 0, 0, globalEnv));

        if (suma instanceof Symbol) {
            expect(suma.value).toBe(15.5);  // 10 + 5.5
        }
        if (resta instanceof Symbol) {
            expect(resta.value).toBe(7);  // 10 - 3
        }
        if (potencia instanceof Symbol) {
            expect(potencia.value).toBe(100);  // 10^2
        }
        if (modulo instanceof Symbol) {
            expect(modulo.value).toBe(1);  // 10 % 3
        }
    });

    test('Relational and logical operations should result in correct values', () => {
        let esMayor = globalEnv.getSymbol(new Symbol("esMayor", Primitive.NULL, null, VariableTypes.VAR, 0, 0, globalEnv));

        if (esMayor instanceof Symbol) {
            expect(esMayor.value).toBe(true);  // x > y && x != 0
        }
    });

    test('Ternary operator should assign correct value to "resultado"', () => {
        let resultado = globalEnv.getSymbol(new Symbol("resultado", Primitive.NULL, null, VariableTypes.VAR, 0, 0, globalEnv));

        if (resultado instanceof Symbol) {
            expect(resultado.value).toBe("Mayor a 15");  // suma > 15 ? "Mayor a 15" : "Menor o igual a 15"
        }
    });

    test('Function "sumaNumeros" should return correct sum', () => {
        let callSumaNumero = new CallFunc(
            "sumanumeros",
            [
                { id: "a", val: new PrimitiveVal("3", Primitive.INT, 0, 0) },
                { id: "b", val: new PrimitiveVal("7", Primitive.INT, 0, 0) }
            ],
            0,
            0
        );
        let result = callSumaNumero.getValue(tree, globalEnv);
        let resultType = new ReturnType(Primitive.INT, 10);
        expect(result).toStrictEqual(resultType);
    });

    test('Function "imprimirMensaje" should echo correct message', () => {
        const mensaje = "La suma de 3 y 7 es: 10";
        let callImprimirMensaje = new CallFunc(
            "imprimirmensaje",
            [
                { id: "mensaje", val: new PrimitiveVal(mensaje, Primitive.STRING, 0, 0) }
            ],
            0,
            0
        );
        let result = callImprimirMensaje.getValue(tree, globalEnv);
        expect(tree.stdOut).toContain(mensaje);
    });


   afterAll(() => {
        // Define the path where the HTML file will be saved
        const htmlFilePath = path.join(__dirname, 'medium_file_3_output.html');

        // HTML template structure
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Medium 3</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>Medium 3 Program Output</h1>
                <pre>${tree.stdOut}</pre>
            </body>
            </html>
        `;

        // Write the HTML content to the file
        writeFileSync(htmlFilePath, htmlContent, 'utf8');
    });

});
