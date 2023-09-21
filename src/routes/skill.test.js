const request = require('supertest');
const app = require('../app'); // Import your Express app
const { mongoConnect, mongoDisconnect } = require('../utils/mongoDB');
//--------------------------------//
const adminAccessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWNjZXNzIiwiaWQiOiI2NTA0YmRlYWExZjliMTU1NGI5YjAwNzYiLCJ1c2VyVHlwZSI6ImFkbWluIiwiaWF0IjoxNjk0ODk2NDk2LCJleHAiOjE2OTQ4OTczOTZ9.V5pNXrzSQ60tcFFO9MNTq9ip9YqEDtB9kAqTuVydBWk`;
const adminRefreshToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmVmcmVzaCIsImlkIjoiNjUwNGJkZWFhMWY5YjE1NTRiOWIwMDc2IiwidXNlclR5cGUiOiJhZG1pbiIsInJlZnJlc2hTZXNzaW9uIjoiNjUwNjExNzBmM2Q5NjI3ZGJjNDY0ZWRmIiwiaWF0IjoxNjk0ODk2NDk2LCJleHAiOjE2OTU1MDEyOTZ9.hG9PFzyblPOQnTPvZbxgZzSyHF-u-ejPbQnezD1-QRU`;
//--------------------------------//
beforeAll(async () => {
    await mongoConnect();
});

afterAll(async () => {
    await mongoDisconnect();
});

describe('Skill API Endpoints', () => {
    let skillId;

    it('should create a new skill', async () => {
        const newSkillData = {
            name: 'New Skill',
            description: 'Description of the new skill'
        };

        const response = await request(app)
            .post('/api/skills')
            .set(
                'Authorization',
                `Bearer ${adminAccessToken} ${adminRefreshToken}`
            )
            .send(newSkillData);

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data.name).toBe(newSkillData.name);
        expect(response.body.data.description).toBe(newSkillData.description);

        skillId = response.body.data._id; // Save the ID of the new skill for later use
    });

    it('should get all skills', async () => {
        const response = await request(app).get('/api/skills');

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should get a single skill by ID', async () => {
        const response = await request(app).get(`/api/skills/${skillId}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data._id).toBe(skillId);
    });

    it('should delete a skill', async () => {
        const response = await request(app)
            .delete(`/api/skills/${skillId}`)
            .set(
                'Authorization',
                `Bearer ${adminAccessToken} ${adminRefreshToken}`
            );

        expect(response.statusCode).toBe(204);
    });
});
