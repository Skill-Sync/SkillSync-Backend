exports.filterObj = (obj, ...allowedAtt) => {
  const newObj = {};
  for (att in obj) {
    if (allowedAtt.includes(att)) {
      newObj[att] = obj[att];
    }
  }
  return newObj;
};
exports.standMentorsMeeting = meeting => {
  const meetingObj = {
    _id: meeting._id,
    status: meeting.status,
    scheduledDate: meeting.scheduledDate,
    user: {
      _id: meeting.user?._id,
      name: meeting.user?.name,
      photo: meeting.user?.photo
    }
  };
  return meetingObj;
};

exports.standUsersMeeting = meeting => {
  const meetingObj = {
    _id: meeting._id,
    status: meeting.status,
    scheduledDate: meeting.scheduledDate,
    mentor: {
      _id: meeting.mentor?._id,
      name: meeting.mentor?.name,
      photo: meeting.mentor?.photo,
      skill: meeting.mentor?.skill?.name
    }
  };
  return meetingObj;
};
