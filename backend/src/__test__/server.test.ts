import { describe, expect, test } from '@jest/globals';
import app from "../api/server";
import supertest from 'supertest';

const request = supertest(app);
//const req = request('http://localhost:5000/');

describe("Api Test", function() {
    it("Testing API under /api/", async function(){
        const res = await request.get('/api/');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("OK :)");
    });

    it("Probar ruta del interprete /api/interprete/test", async function(){
        const res = await request.get("/api/interprete/test/");

        expect(res.status).toBe(200);
        expect(res.body.message).toBe("Okay");
    });

});