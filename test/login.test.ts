import { app } from "../src/app";
import supertest from "supertest";

describe('Login', () => {
    it('should login succesfully', async () => {
        const response = await supertest(app)
            .post('/login')
            .send({
                email: 'heyhey@gmail.com', 
                password: '123123'
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
