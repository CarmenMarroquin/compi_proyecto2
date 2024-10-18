import { describe, expect, test } from '@jest/globals';
import supertest from 'supertest';
import path from "path";
import { readFileSync } from 'fs';
import { CompInterpreterParser, CompInterpreterLexer } from '../analizador/gramatica';

describe("Testing parser logics", function() {
    it("Testing a general example of the program", function() {
        var testPath = path.join(__dirname, '..', '..', 'testFiles', 'good_general.test.ci');
        const data = readFileSync(testPath, 'utf8');

        const lexer = new CompInterpreterLexer();
        let any = lexer.setInput(data, {});
        let tokens: Array<any> = [];

        while (!any.done){
            let token = any.next();
            if (typeof token === "string"){

                tokens.push(token);
            }
        }

        const parser = new CompInterpreterParser();
        let instructions: Array<any> = parser.parse(data);
    });

    it("Testing TestFile 1", function() {
        var testPath = path.join(__dirname, '..', '..', 'testFiles', 'archivoCalif.test.ci');
        const data = readFileSync(testPath, 'utf8');

        const lexer = new CompInterpreterLexer();
        let any = lexer.setInput(data, {});
        let tokens: Array<any> = [];

        while (!any.done){
            let token = any.next();
            if (typeof token === "string"){

                tokens.push(token);
            }
        }

        const parser = new CompInterpreterParser();
        let instructions: Array<any> = parser.parse(data);
    });


    it("Testing TestFile 2", function() {
        var testPath = path.join(__dirname, '..', '..', 'testFiles', 'archivoCalif2.test.ci');
        const data = readFileSync(testPath, 'utf8');

        const lexer = new CompInterpreterLexer();
        let any = lexer.setInput(data, {});
        let tokens: Array<any> = [];

        while (!any.done){
            let token = any.next();
            if (typeof token === "string"){

                tokens.push(token);
            }
        }

        const parser = new CompInterpreterParser();
        let instructions: Array<any> = parser.parse(data);
    });


    it("Testing TestFile 3", function() {
        var testPath = path.join(__dirname, '..', '..', 'testFiles', 'archivoCalif3.test.ci');
        const data = readFileSync(testPath, 'utf8');

        const lexer = new CompInterpreterLexer();
        let any = lexer.setInput(data, {});
        let tokens: Array<any> = [];

        while (!any.done){
            let token = any.next();
            if (typeof token === "string"){

                tokens.push(token);
            }
        }

        const parser = new CompInterpreterParser();
        let instructions: Array<any> = parser.parse(data);
    });


});
