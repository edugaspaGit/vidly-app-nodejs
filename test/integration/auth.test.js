
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const request = require('supertest');

//let server; to avoid start the server twice

describe('auth middleware', () => {
    beforeEach(() => {
        server = require('../../index');
    })
    afterEach(async () => {        
        server.close();
        await Genre.deleteMany();
    });

    let token;
    let name;

    const post = () => {
        return request(server)
            .post('/api/genres/')
            .set('x-auth-token', token)
            .send({ name });
    };

    beforeEach(() => {
        //server = require('../../index');
        token = new User().generateAuthToken();
        name = 'genre1';
    })

    // afterEach(async () => {
    //     await Genre.deleteMany();
    //     server.close();
    // });

    it('return 401 if token is not provided', async () => {
        token = '';
        const res = await post();
        expect(res.status).toBe(401);
    })

    it('return 400 if the token is invalid', async () => {
        token = '1234';
        const res = await post();
        expect(res.status).toBe(400);
    })

    it('return 200 if the token is valid', async () => {
        let genre = await Genre.findOne({ name });
        expect(genre).toBeNull();
        const res = await post();
        expect(res.status).toBe(200);
    })
})