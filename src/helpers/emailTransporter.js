import nodemailer from 'nodemailer'
import ENVIRONMENT from '../config/environment.js'

const transporterEmail= nodemailer.createTransport({
    service: 'gmail',
    tls:{
        rejectUnauthorized: false
    },
    auth: {
        user: ENVIRONMENT.EMAIL_USER,
        pass: ENVIRONMENT.EMAIL_PASSWORD
    }
})

export default transporterEmail