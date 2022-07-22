// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.OAUTH_CLIENT_ID,
//   process.env.OAUTH_CLIENT_SECRET,
//   process.env.REDIRECT_URI
// );

// oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// async function sendMail(recipient, title, body) {
//   try {
//     const accessToken = await oAuth2Client.getAccessToken();
//     const transport = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "oauth2",
//         user: "deividas.aldonis.dev@gmail.com",
//         clientId: process.env.OAUTH_CLIENT_ID,
//         clientSecret: process.env.OAUTH_CLIENT_SECRET,
//         refreshToken: process.env.REFRESH_TOKEN,
//         accessToken: accessToken,
//       },
//     });

//     const mailOptions = {
//       from: "NOTES APP <deividas.aldonis.dev@gmail.com>",
//       to: recipient,
//       subject: "Reminder!",
//       text: `${title}\n${body}`,
//       html: `<h1>${title}</h1>
//              <p>${body}</p> `,
//     };

//     const result = await transport.sendMail(mailOptions);
//     return result;
//   } catch (error) {
//     return error;
//   }
// }



const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendMail = async (recipient, title, body) => {
  const msg = {
    to: recipient, // Change to your recipient
    from: "deividas.aldonis.dev@gmail.com", // Change to your verified sender
    subject: title,
    text: body,
    html: `<strong>${body}</strong>`,
  };

  try {
    await sgMail.send(msg)
    console.log("Email sent")
  } catch (error) {
    console.log(error)
    return error    
  }
}

module.exports = sendMail



