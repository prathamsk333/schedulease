import nodemailer from "nodemailer";
import { convert } from "html-to-text";
import pug from "pug";
import path from "path";

import { IUser } from "../model/userModal";

export default class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Schedulease <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    console.log(
      process.env.NODE_ENV,
      process.env.BREVO_HOST,
      process.env.BREVO_PORT,
      process.env.SENDINBLUE_USERNAME,
      process.env.BREVO_PASSWORD
    );
    if (process.env.NODE_ENV === "development") {
      return nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: Number(process.env.BREVO_PORT),
        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.BREVO_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template: string, subject: string) {
    const html = pug.renderFile(
      path.join(__dirname, "../views/email", `${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
      attachments: [
        {
          filename: "s5.png",
          path: path.join(__dirname, "../views/email/s5.png"),
          cid: "logoImage",
        },
      ],
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to Schedulease!");
  }

  async sendPasswordReset() {
    await this.send(
      "welcome",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
}
