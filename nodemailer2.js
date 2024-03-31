const nodemailer = require("nodemailer");

exports.sendmail2 = function (req, res, email) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "khileshnature28@gmail.com",
      pass: "mqfgkmgvvwhmrawu",
    },
  });

  const mailOptions = {
    from: "xyz <khileshnature@gmail.com>",
    to: email,
    subject: "Thank you for enquiry to xyz.",
    text: `Thank you for enquiry and welcome to xyz. phone:`,
  };

  const adminMailOptions = {
    from: "xyz company <xyz@gmail.com>",
    to: "khileshnature28@gmail.com",
    subject: "New registration on xyz.",
    text: `You have new registration on xyz.`,
  };

  transport.sendMail(adminMailOptions, (err, info) => {
    if (err) {
      console.error("Error sending admin email:", err);
    } else {
      console.log("Admin email sent:", info);
    }
  });

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending user email:", err);
      return res.status(500).send("<script> alert(' Error sending email to user')</script>");
    } else {
      console.log("User email sent:", info);
      return res.redirect("/cart");
    }
  });
};