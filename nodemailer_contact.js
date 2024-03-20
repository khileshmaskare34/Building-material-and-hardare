const nodemailer = require("nodemailer");

exports.sendmail_cont = function (req, res, email, phone, product, address) {
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
    from: "Alnakiya Pvt. Ltd.<khileshnature@gmail.com>",
    to: email,
    subject: "Thank you for enquiry to Alnakiya.",
    text: `Thank you for enquiry and welcome to Alnakiya. phone: ${phone}, product: ${product}, address: ${address}`,
  };

  const adminMailOptions = {
    from: "NAFSCARE Pvt. Ltd.<chakravartiashish2406@gmail.com>",
    to: "shehbaz_vayani@randomforest.in",
    subject: "New registration on Alnakiya.",
    text: `You have new registration on Alnakiya.`,
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
    //   return res.redirect("/cart");
    }
  });
};