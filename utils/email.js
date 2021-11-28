const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");

// new Email(user, url).sendWelcome();
// new Email(user, url).sendReset();

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName.split(" ")[0];
    this.url = url;
    this.password = user.password;
    this.businessName = user.businessName;
    this.from = `Michael White <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  /**
   * Sends the actual email
   * @param {string} template - Pug template to be rendered
   * @param {string} subject - Subject of the email
   */
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
      password: this.password,
      businessName: this.businessName,
      email: this.to,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  /** Sends Welcome Email */
  async sendWelcome() {
    await this.send("welcome", "Welcome to the Beyond Infinity Employee App!");
  }

  /** Sends Password Reset Email */
  async sendPasswordReset() {
    await this.send("passwordReset", "Reset your password");
  }

  /** Sends Instant Site to the client */
  async sendclientInstantSite() {
    await this.send(
      "clientInstantSite",
      `New Website for ${this.businessName}`
    );
  }
};
