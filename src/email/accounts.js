const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: {
        name: "Task Manager App (Bala)",
        email: "balakumar.arunbala@gmail.com",
      },
      subject: "Thanks for joining Task Manager",
      text: `We are glad to welcome you onboard ${name}, Hope we keep your trust on us. Enjoy your task manager application experience. Have a nice day`,
      html: `<div><h1>We are glad to welcome you onboard ${name}</h1><br/><p>Hope we keep your trust on us. Enjoy your task manager application experience. Have a nice day</p></div>`,
    })
    .then((res) => {
      console.log("Email sent...");
      console.log(res);
    })
    .catch((err) => console.log(err.message));
};

const sendCancellationEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: {
        name: "Task Manager App (Bala)",
        email: "balakumar.arunbala@gmail.com",
      },
      subject: "GoodBye from Task Manager",
      text: `We are sorry to loose you ${name}, Hope in future we better our features and get back you onboarded again!. All the best for your success. Thanks for being with us all this days.Have a nice day`,
      html: `<div><h1>We are sorry to loose you ${name}</h1><br/><p>Hope in future we better our features and get back you onboarded again!. All the best for your success. Thanks for being with us all this days.Have a nice day</p></div>`,
    })
    .then((res) => {
      console.log("Email sent...");
      console.log(res);
    })
    .catch((err) => console.log(err.message));
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
