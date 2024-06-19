const Event = require("../models/eventModel");
const cron = require("node-cron");
const moment = require("moment");
const nodemailer = require("nodemailer");

cron.schedule("* * * * *", async () => {
  try {
    let twoHoursLaterFromNow = moment().add(2, "hours").toISOString();
    console.log(twoHoursLaterFromNow);

    const events = await Event.find({
      startDate: { $gte: moment(), $lte: twoHoursLaterFromNow },
    }).populate("participants");
console.log(events);
    events.forEach((event) => {
      console.log("rrr",event)
      let eventOrganizer = event.organizer;
      console.log(eventOrganizer)
      event.participants.forEach(async (participant) => {
        try {
          const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "c604d13959141c",
              pass: "fefff4c7cb19f4",
            },
          });
          console.log("thissssssss",transporter)
          const mailOptions = {
            from: eventOrganizer,
            to: participant.email,
            subject: "Event Start Notification",
            text: `Event will start in 2 hours `,
          };
          await transporter.sendMail(mailOptions);
        } catch (err) {
          throw err;
        }

        console.log(
          `Notification sent to ${participant.username} for event ${event.title}`
        );
      });
    });
  } catch (error) {
    console.error("Error fetching or processing events:", error.message);
  }
});


module.exports = cron;