//const expressAsyncHandler = require('express-async-handler')
const nodemailer = require('nodemailer')

const sendMail = async (email, subject, text) => {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    await transport.sendMail({
      from: {
        name: 'Murtala from Fiska express',
        address: process.env.EMAIL_USERNAME
      },
      to: email,
      subject: subject,
      html: `<h3> Please Verify Your Account by clicking the link below</h3><br><p><a href="${text}">Click Here</a></p>`
    })
    console.log('email sent successfully')
  } catch (error) {
    console.log('Problem has occured, email not sent')
    console.log(error)
  }
}

module.exports = sendMail
