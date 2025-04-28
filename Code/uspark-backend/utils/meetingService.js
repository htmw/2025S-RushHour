async function scheduleGoogleMeet({
  date,
  startTime,
  patientName,
  doctorName,
  patientEmail,
  doctorEmail,
}) {
  console.log("Mocking Google Meet link creation...");
  console.log({
    date,
    startTime,
    patientName,
    doctorName,
    patientEmail,
    doctorEmail,
  });

  // Return a mock Google Meet link
  return `https://meet.google.com/mock-meeting?date=${date}&time=${startTime}`;
}

module.exports = {
  scheduleGoogleMeet,
};

// const { google } = require("googleapis");
// const path = require("path");

// // Schedule a Google Meet
// async function scheduleGoogleMeet({
//   date,
//   startTime,
//   patientName,
//   doctorName,
//   patientEmail,
//   doctorEmail,
// }) {
//   console.log({
//     date,
//     startTime,
//     patientName,
//     doctorName,
//     patientEmail,
//     doctorEmail,
//   });

//   // Use Google Calendar API to create a meeting
//   const auth = new google.auth.GoogleAuth({
//     keyFile: path.join(__dirname, "../uspark-458206-4c8fa07be950.json"), // Adjust the relative path
//     scopes: ["https://www.googleapis.com/auth/calendar"],
//   });

//   const calendar = google.calendar({ version: "v3", auth });

//   const event = {
//     summary: `Appointment with Dr. ${doctorName}`,
//     description: `Meeting with ${patientName}`,
//     start: {
//       dateTime: `${date}T${startTime}:00`,
//       timeZone: "America/New_York", // Replace with your timezone
//     },
//     end: {
//       dateTime: `${date}T${startTime}:30`, // Assuming 30-minute slots
//       timeZone: "America/New_York",
//     },
//     attendees: [{ email: patientEmail }, { email: doctorEmail }],
//     conferenceData: {
//       createRequest: {
//         requestId: `req-${Date.now()}`, // Generate a unique request ID
//         conferenceSolutionKey: { type: "hangoutsMeet" },
//       },
//     },
//   };

//   const response = await calendar.events.insert({
//     calendarId: "primary",
//     resource: event,
//     conferenceDataVersion: 1,
//   });

//   return response.data.hangoutLink;
// }

// module.exports = {
//   scheduleGoogleMeet,
// };
