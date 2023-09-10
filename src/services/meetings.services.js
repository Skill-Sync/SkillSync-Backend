// exports.calculateMeetingSlots = (mentorWorkingHours, day) => {
const calculateMeetingSlots = function(mentorWorkingHours, day) {
  const meetingSlots = [];
  const [startHour, endHour] = mentorWorkingHours
    .split('-')
    .map(time => parseInt(time));

  for (let hour = startHour; hour < endHour; hour++) {
    const slotStartTime = new Date(day);
    slotStartTime.setHours(hour, 0, 0, 0);

    meetingSlots.push(slotStartTime);
  }
  return meetingSlots;
};

module.exports = calculateMeetingSlots;
