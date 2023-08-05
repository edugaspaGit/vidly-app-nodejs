
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const request = require('supertest');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); })
    afterEach(async () => {
        server.close();
        await Genre.deleteMany();
    });

    describe('GET /', () => {
        it('return all the genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        })
    })

    describe('GET /:id', () => {
        it('return a single genre', async () => {
            await Genre.collection.insertOne({ name: 'genre1' });
            const genre = await Genre.findOne();
            //const res = await request(server).get(`/api/genres/:${genre._id}`);
            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        })
        it('return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
            expect(res.text).toBe('Invalid ID.');
        })
    })

    describe('POST', () => {
        let token;
        let name;

        const post = () => {
            return request(server)
                .post('/api/genres/')
                .set('x-auth-token', token)
                .send({ name });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('return 401 if client is not logged in', async () => {
            token = '';
            const res = await post();
            expect(res.status).toBe(401);
        })
        it('return 400 if genre name is less than 5 characters', async () => {
            name = '1234';
            const res = await post();
            expect(res.status).toBe(400);
        })

        it('return 400 if genre name is greater than 50 characters', async () => {
            name = new Array(52).join('e');
            const res = await post();
            expect(res.status).toBe(400);
        })

        it('post a genre if it is valid and does not exist', async () => {
            let genre = await Genre.findOne({ name: 'genre1' });
            expect(genre).toBeNull();
            const res = await post();
            genre = Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        })

        it('return a genre if it is valid and does not exist', async () => {
            let genre = await Genre.findOne({ name: 'genre1' });
            expect(genre).toBeNull();
            const res = await post();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        })
    })

    describe('PUT /:id', () => {

        let token;
        let genre;
        let name;
        let id;

        const put = () => {
            return request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name });
        };

        beforeEach(async () => {
            token = new User().generateAuthToken();
            name = 'genre2';
            // Before each test we need to create a genre and 
            // put it in the database.      
            await Genre.collection.insertOne({ name: 'genre1' });
            genre = await Genre.findOne({ name: 'genre1' });
            id = genre._id;
        })

        it('return 401 if client is not logged in', async () => {
            token = '';
            const res = await put();
            expect(res.status).toBe(401);
        })

        it('return 400 if genre name is less than 5 characters', async () => {
            name = '1234';
            const res = await put();
            expect(res.status).toBe(400);
        })

        it('return 400 if genre name is greater than 50 characters', async () => {
            name = new Array(52).join('e');
            const res = await put();
            expect(res.status).toBe(400);
        })

        it('return 404 if the genre.id is not valid', async () => {
            id = 1;
            const res = await put();
            expect(res.status).toBe(404);
        })

        it('return 404 if the genre is not found in the db', async () => {
            id = mongoose.Types.ObjectId();
            const res = await put();
            expect(res.status).toBe(404);
        })

        it('modify a genre if it exists, is valid and the client is logged in', async () => {

            const res = await put();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', name);
        })
    })

    describe(' DELETE/:id', () => {

        let token;
        let genre;
        // let name;
        let id;

        const deletion = () => {
            return request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token);
            //.send();
        };

        beforeEach(async () => {

            token = new User({ isAdmin: true }).generateAuthToken();

            // Before each test we need to create a genre and 
            // put it in the database.      
            await Genre.collection.insertOne({ name: 'genre1' });
            genre = await Genre.findOne({ name: 'genre1' });
            id = genre._id;
        })

        it('return 401 if client is not logged in', async () => {
            token = '';
            const res = await deletion();
            expect(res.status).toBe(401);
        })

        it('return 404 if the genre.id is not valid', async () => {
            id = 1;
            const res = await deletion();
            expect(res.status).toBe(404);
        })

        it('return 404 if the genre is not found in the db', async () => {
            id = mongoose.Types.ObjectId();
            const res = await deletion();
            expect(res.status).toBe(404);
        })

        it('delete a genre if passes the validations ', async () => {
            const res = await deletion();
            genre = await Genre.findOne({ name: 'genre1' });
            expect(res.status).toBe(200);
            expect(genre).toBeNull();          
        })

        it('delete a genre if passes the validations ', async () => {
            const res = await deletion();            
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);

        })
    })
})