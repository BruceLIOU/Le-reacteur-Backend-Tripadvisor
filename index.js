require("dotenv").config();
const express = require("express");
const formidable = require("express-formidable");
const cors = require("cors");

const app = express();
app.use(formidable());
app.use(cors());

// //MailGun configuration
const api_key = process.env.MAIL_GUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

//Route en get
app.get("/", async (req, res) => {
  try {
    res.status(200).json("route get");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Route en post
app.post("/", (req, res) => {
  //Destructuring
  console.log(req.fields);
  const { firstname, lastname, email, subject, message } = req.fields;

  // Création de l'objet DATA
  const data = {
    from: `${firstname} ${lastname} <${email}>`,
    to: "bruceliou@free.fr", //email de mailGun
    subject: subject,
    text: message,
  };
  // Envoie de l'objet DATA via MailGun
  mailgun.messages().send(data, (error, body) => {
    if (!error) {
      console.log(data);
      return res.status(200).json(body);
    } else {
      console.log(error);
      res.status(401).json(error);
    }
  });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("server started");
});
