const request = require('supertest');
const app = require('../app'); // Assuming your Express app is in this file
const { mongoConnect, mongoDisconnect } = require('../utils/mongoDB');
//--------------------------------//
const UserAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWNjZXNzIiwiaWQiOiI2NTA0YmRlYWExZjliMTU1NGI5YjAwNjUiLCJ1c2VyVHlwZSI6InVzZXIiLCJpYXQiOjE2OTQ4OTE1NDAsImV4cCI6MTY5NDg5MjQ0MH0.CNrsSxPBCJ3NveCQUyRolfBdbHws3H6suy4SH74lAls`;
const UserRefreshToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVmcmVzaCIsImlkIjoiNjUwNGJkZWFhMWY5YjE1NTRiOWIwMDY1IiwidXNlclR5cGUiOiJ1c2VyIiwicmVmcmVzaFNlc3Npb24iOiI2NTA1ZmUxNGE5MDFjNGQ4YzUwOGFjMWYiLCJpYXQiOjE2OTQ4OTE1NDAsImV4cCI6MTY5NTQ5NjM0MH0.g-PRJ_sv3hjCQqGzFaLpsnzkmVIuOnkzRTYURiqE_3A`;

const mentorAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWNjZXNzIiwiaWQiOiI2NTA0YmRmN2ExZjliMTU1NGI5YjAwODkiLCJ1c2VyVHlwZSI6Im1lbnRvciIsImlhdCI6MTY5NDg5MzUxNiwiZXhwIjoxNjk0ODk0NDE2fQ.hRqd90Y8UqSQrgLeajv5hJJTxD67_WOXKmmi4uHFnGY`;
const mentorRefreshToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVmcmVzaCIsImlkIjoiNjUwNGJkZjdhMWY5YjE1NTRiOWIwMDg5IiwidXNlclR5cGUiOiJtZW50b3IiLCJyZWZyZXNoU2Vzc2lvbiI6IjY1MDYwNWNjNWQ4ZWIwYzllNzI2ODAzNyIsImlhdCI6MTY5NDg5MzUxNiwiZXhwIjoxNjk1NDk4MzE2fQ.LqROYWhiFj1BzmE8s0MtOc5AV1hAJ6tpilJJovZsGCM`;
//--------------------------------//
const testUser = {
    _id: 'testUserId',
    userType: 'user'
};

const testMeeting = {
    _id: '6504e775469e21d5c0bfef66',
    mentor: '6504bdf7a1f9b1554b9b0089',
    user: '6504bdeaa1f9b1554b9b0065'
};

beforeAll(async () => {
    await mongoConnect();
});

afterAll(async () => {
    await mongoDisconnect();
});

describe('Express Routes', () => {
    it('should get user meetings', async () => {
        const response = await request(app)
            .get('/meetings')
            .set(
                'Authorization',
                `Bearer ${UserAccessToken} ${UserRefreshToken}`
            )
            .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should get a meeting by ID', async () => {
        const response = await request(app)
            .get(`/meetings/${testMeeting._id}`)
            .set(
                'Authorization',
                `Bearer ${UserAccessToken} ${UserRefreshToken}`
            )
            .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.data._id).toBe(testMeeting._id);
    });

    it('should create a new meeting', async () => {
        const response = await request(app)
            .patch(`/meetings/6504e775469e21d5c0bfef71`)
            .set(
                'Authorization',
                `Bearer ${UserAccessToken} ${UserRefreshToken}`
            )
            .send({})
            .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.data.status).toBe('accepted');
    });

    it('should update a meeting', async () => {
        const response = await request(app)
            .post(`/meetings/6504e775469e21d5c0bfef71`)
            .set(
                'Authorization',
                `Bearer ${mentorAccessToken} ${mentorRefreshToken}`
            )
            .send({ status: 'accepted' })
            .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.data.status).toBe('accepted');
    });
});
