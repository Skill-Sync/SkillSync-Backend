const request = require('supertest');
const app = require('../app');
const { mongoConnect, mongoDisconnect } = require('../utils/mongoDB');
//--------------------------------//
describe('Authentication and Authorization endpoints testing', () => {
    beforeAll(async () => {
        await mongoConnect();
    });

    afterAll(async () => {
        await mongoDisconnect();
    });

    describe('Authentication', () => {
        const UserSignUpData = {};
        const InvalidUserSignUpData = {};

        const MentorSignUpData = {};
        const InvalidMentorSignUpData = {};

        const UserLoginData = {};
        const InvalidUserLoginData = {};

        describe('Signup endpoints', () => {
            test('User signup should respond with 201', async () => {
                const response = await request(app)
                    .post('/api/v1/authRouter/signup')
                    .send(UserSignUpData)
                    .expect('Content-Type', /json/)
                    .expect(201);
                expect(response.body.user.role).toBe('user');
            });

            test('Mentor signup should respond with 201', async () => {
                const response = await request(app)
                    .post('/api/v1/authRouter/signup')
                    .send(MentorSignUpData)
                    .expect('Content-Type', /json/)
                    .expect(201);
                expect(response.body.user.role).toBe('mentor');
            });

            test('User signup should catch missing required properties', async () => {
                const response = await request(app)
                    .post('/api/v1/authRouter/signup')
                    .send(InvalidUserSignUpData)
                    .expect('Content-Type', /json/)
                    .expect(400);
            });

            test('Mentor signup should catch missing required properties', async () => {
                const response = await request(app)
                    .post('/api/v1/authRouter/signup')
                    .send(InvalidMentorSignUpData)
                    .expect('Content-Type', /json/)
                    .expect(400);
            });
        });

        describe('Login endpoints', () => {
            test('User login should respond with 200', async () => {
                const response = await request(app)
                    .post('/api/v1/authRouter/login')
                    .send(UserLoginData)
                    .expect('Content-Type', /json/)
                    .expect(200);
            });

            test('User login should catch missing required properties', async () => {
                const response = await request(app)
                    .post('/api/v1/authRouter/login')
                    .send(InvalidUserLoginData)
                    .expect('Content-Type', /json/)
                    .expect(400);
            });
        });
    });

    describe('Authorization', () => {
        // Authorization endpoints such as ask for new access token using refresh token will be tested here
    });
});
