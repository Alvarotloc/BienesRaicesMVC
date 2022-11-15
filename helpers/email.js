import nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'

dotenv.config()

const emailRegistro = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
  const { email, nombre, token } = data
  await transport.sendMail({
    from: 'info@bienesraices.com',
    to: email,
    subject: 'Confirma tu cuenta en Bienes Raices',
    text: 'Confirma tu cuenta en Bienes Raices',
    html: `
        <p>Hola ${nombre}, comprueba tu cuenta en Bienes Raices</p>

        <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace: 
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 4000}/auth/confirmar/${token}">Confirmar Cuenta</a>
        </p>

        <p>Si tu no creaste esta cuenta puedes ignorar este email</p>
    `
  })
}

export {
  emailRegistro
}
