exports.filterObj = (obj, ...allowedAtt) => {
  const newObj = {};
  for (att in obj) {
    if (allowedAtt.includes(att)) {
      newObj[att] = obj[att];
    }
  }
  return newObj;
};

exports.standarizeUser = user => {
  const userObj = {
    _id: user._id,
    role: user.role,
    active: user.active,
    about: user.about,
    name: user.name,
    email: user.email,
    isEmployed: user.isEmployed,
    skillsToLearn: user.skillsToLearn,
    skillsLearned: user.skillsLearned
  };
  return userObj;
};

exports.standarizeMentor = user => {
  const userObj = {
    _id: user._id,
    role: user.role,
    active: user.active,
    about: user.about,
    name: user.name,
    email: user.email,
    identityCard: user.identityCard,
    courses: user.courses,
    experience: user.experience
  };
  return userObj;
};

exports.standMentorsMeeting = meeting => {
  const meetingObj = {
    _id: meeting._id,
    status: meeting.status,
    scheduledDate: meeting.scheduledDate,
    user: {
      _id: meeting.user?._id,
      name: meeting.user?.name,
      email: meeting.user?.email,
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
      _id: meeting.mentor._id,
      name: meeting.mentor.name,
      email: meeting.mentor.email,
      photo: meeting.mentor.photo
    }
  };
  return meetingObj;
};
