const axios = require('axios').default;

const DYTE_API_BASE_URL = 'https://api.dyte.io/v2';
const DYTE_API_TOKEN = `${process.env.ORG_ID}:${process.env.API_KEY}`;

exports.createDyteMeeting = async function(title) {
    try {
        const response = await axios.post(
            `${DYTE_API_BASE_URL}/meetings`,
            {
                title: `${title}`,
                preferred_region: 'ap-south-1',
                record_on_start: false,
                live_stream_on_start: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${DYTE_API_TOKEN}`
                }
            }
        );

        return response.data.id;
    } catch (error) {
        console.error('Error creating Dyte meeting:', error);
        throw error;
    }
};

exports.addUserToMeeting = async function(meetingId, userData) {
    try {
        const url = `${DYTE_API_BASE_URL}/meetings/${meetingId}/participants`;
        const response = await axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${DYTE_API_TOKEN}`
            }
        });

        return response.data.token;
    } catch (error) {
        console.error('Error adding user to Dyte meeting:', error);
        throw error;
    }
};

const userData = {
    name: '',
    picture: '',
    preset_name: '',
    custom_participant_id: ''
};
