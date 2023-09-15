const axios = require('axios').default;

const DYTE_API_Meeting_URL = 'https://api.dyte.io/v2/meetings';
const DYTE_API_Adding_URL = `https://api.dyte.io/v2
/meetings/{meeting_id}/participants`;

const DYTE_API_TOKEN = `${process.env.ORG_ID}:${process.env.API_KEY}`;

async function createDyteMeeting(title) {
    try {
        const response = await axios.post(
            DYTE_API_Meeting_URL,
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
}

// Example usage:
const meetingTitle = 'My Dyte Meeting';
createDyteMeeting(meetingTitle)
    .then(meetingId => {
        console.log('Created Dyte Meeting with ID:', meetingId);
    })
    .catch(error => {});

//add participant -->auth token
