const Event = require("../models/eventModel");
const cron = require("node-cron");
const moment = require("moment");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "c604d13959141c",
    pass: "fefff4c7cb19f4",
  },
}); 

cron.schedule("0 * * * *", async () => {
  try {
    let twoHoursLaterFromNow = moment().add(2, "hours").toISOString();
    console.log(twoHoursLaterFromNow);

    const events = await Event.find({
      startDate: { $gte: moment().toISOString(), $lte: twoHoursLaterFromNow },
    }).populate("participants");

   for (const event of events){
  
      let eventOrganizer = event.organizer;
  
      for(const participant of event.participants){
        try {
    

          const mailOptions = {
            from: eventOrganizer,
            to: participant.email,
            subject: "Event Start Notification",
            text: `Event will start in 2 hours `,
          };
          console.log("something");
          transporter.sendMail(mailOptions);
        } catch (err) {
          console.log(err.message);
        }

        console.log(
          `Notification sent to ${participant.username} for event ${event.title}`
        );
      }
    }
  } catch (error) {
    console.error("Error fetching or processing events:", error.message);
  }
});


module.exports = cron;