const axios = require('axios').default;

exports.createDyteMeeting = async title => {
    try {
        const response = await axios.post(
            `${process.env.DYTE_BASE_URL}/meetings`,
            {
                title: `${title}`,
                preferred_region: 'ap-south-1',
                record_on_start: false,
                live_stream_on_start: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${process.env.DYTE_API_TOKEN}`
                }
            }
        );
        return response.data.data.id;
    } catch (error) {
        console.error('Error creating Dyte meeting:', error.message);
    }
};

exports.addUserToMeeting = async function(meetingId, userData) {
    try {
        const url = `${process.env.DYTE_BASE_URL}/meetings/${meetingId}/participants`;
        const response = await axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${process.env.DYTE_API_TOKEN}`
            }
        });
        return response.data.data.token;
    } catch (error) {
        console.error('Error adding user to Dyte meeting:', error);
    }
};
