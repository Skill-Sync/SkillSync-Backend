const request = require('supertest');
const app = require('../app');
const { mongoConnect, mongoDisconnect } = require('../utils/mongoDB');
//--------------------------------//
const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWNjZXNzIiwiaWQiOiI2NTA0YmRlYWExZjliMTU1NGI5YjAwNjUiLCJ1c2VyVHlwZSI6InVzZXIiLCJpYXQiOjE2OTQ4OTE1NDAsImV4cCI6MTY5NDg5MjQ0MH0.CNrsSxPBCJ3NveCQUyRolfBdbHws3H6suy4SH74lAls`;
const refreshToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVmcmVzaCIsImlkIjoiNjUwNGJkZWFhMWY5YjE1NTRiOWIwMDY1IiwidXNlclR5cGUiOiJ1c2VyIiwicmVmcmVzaFNlc3Npb24iOiI2NTA1ZmUxNGE5MDFjNGQ4YzUwOGFjMWYiLCJpYXQiOjE2OTQ4OTE1NDAsImV4cCI6MTY5NTQ5NjM0MH0.g-PRJ_sv3hjCQqGzFaLpsnzkmVIuOnkzRTYURiqE_3A`;
//--------------------------------//

const mockFriendship = {
    status: 'accepted'
};

beforeAll(async () => {
    await mongoConnect();
});

afterAll(async () => {
    await mongoDisconnect();
});

describe('User Routes', () => {
    it('should get a list of user friends', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${accessToken} ${refreshToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.friends).toBeDefined();
    });

    it('should create or edit a friendship', async () => {
        const response = await request(app)
            .post('/users/6504bdeaa1f9b1554b9b0065')
            .set('Authorization', `Bearer ${accessToken} ${refreshToken}`)
            .send(mockFriendship);

        expect(response.statusCode).toBe(200);
        expect(response.body.newFriendship).toBeDefined();
    });

    it('should delete a friendship', async () => {
        const response = await request(app)
            .delete('/users/6504bdeaa1f9b1554b9b0065')
            .set('Authorization', `Bearer ${accessToken} ${refreshToken}`);

        expect(response.statusCode).toBe(204);
    });
});
