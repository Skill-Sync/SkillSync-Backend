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
