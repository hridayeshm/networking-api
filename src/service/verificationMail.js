import nodemailer from "nodemailer"

const sendVerficationMail = async(values) =>{
    try{
        const transporter = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: 'c604d13959141c',
            pass: 'fefff4c7cb19f4' 
          }
        });
    
        const mailOptions = {
          from: 'hridayesh@gmail.com',
          to: values.email, 
          subject: 'Verification Token',
          text: `Your Verification token: ${values.emailVerificationToken}`
        };
        await transporter.sendMail(mailOptions);
      }catch(err){
        throw err;
      }
}

export default sendVerficationMail;
