import ENVIRONMENT from "../config/environment.js"
import ResponseBuilder from "../helpers/builders/responseBuilder.js"
import { verifyEmail, verifyMinLength, verifyString } from "../helpers/builders/validation.helpers.js"
import User from "../models/user.model.js"
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import transporterEmail from "../helpers/emailTransporter.js"
import jwt from 'jsonwebtoken'

export const registerController= async (req, res)=>{
    const {name, password, email}= req.body
    try{
        const registerConfig= {
            name:{
                value: name,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value)=> verifyMinLength(field_name, field_value, 5)
                ]
            },
            password:{
                value: password,
                errors: [],
                validation: [
                    verifyString,
                    (field_name, field_value)=> verifyMinLength(field_name, field_value, 10)
                ]
            },
            email:{
                value: email,
                errors: [],
                validation: [
                    verifyEmail,
                    (field_name, field_value)=> verifyMinLength(field_name, field_value, 10)
                ]
            }
        }

        let hayErrores= false
        for (let field_name in registerConfig){
            for (let validation of registerConfig[field_name].validation){
                let result= validation(field_name, registerConfig[field_name].value)
                if (result){
                    hayErrores= true
                    registerConfig[field_name].errors.push(result)
                }
            }
        }

        if (hayErrores){
            const response= new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage('VALIDATION_ERROR')
            .setData({
                registerState: registerConfig
            })
            .build()

            return res.json(response)
        }

        //hashear la password
        const hashed_password= await bcrypt.hash(registerConfig.password.value, 10) 

        //validar token
        const validationToken= jwt.sign(
            {
                email: registerConfig.email.value
            },
            ENVIRONMENT.SECRET_KEY,
            {
                expiresIn: '1d'
            }
        )

        const redirectUrl= 'http://localhost:4000/api/auth/verify-email/' + validationToken

        //enviar el mail
        const result= await transporterEmail.sendMail({
            subject: 'Valida tu email',
            to: registerConfig.email.value,
            html: `
                <h1>Valida tu mail</h1>
                <p>Para validar tu mail da click <a href='${redirectUrl}'>AQUI</a></p>
            `
        })

        
        

        const userCreated= new User({
            name: registerConfig.name.value,
            email: registerConfig.email.value,
            password: hashed_password,
            verificationToken: ''
        })
        await userCreated.save() //esto lo guarda en mongo DB


        const response= new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('SUCCESS')
        .setData({
            registerResult: registerConfig
        })
        .build()

        return res.json(response)
    }catch(error){
        if(error.code === 11000){
            const response = new ResponseBuilder()
            .setOk(false)
            .setCode(400)
            .setMessage('Email already registered')
            .setData({
                detail: 'El email ya esta registrado'
            })
            .build()
            return res.json(response)
        }
        
        const response= new ResponseBuilder()
        .setOk(false)
        .setStatus(400)
        .setMessage('Error de servidor')
        .setData({
            detail: error.message
        })
        .build()

        return res.json(response)
    }

}


export const verifyEmailController= async (req,res)=>{
    try{
        const {validation_token}= req.params

        console.log(validation_token)
        const payload= jwt.verify(validation_token,ENVIRONMENT.SECRET_KEY)
        console.log(payload)
        const email_to_verify= payload.email
        const user_to_verify= await User.findOne({email: email_to_verify}) 
        user_to_verify.emailVerified= true
        await user_to_verify.save()
    

        //res.sendStatus(200)
        res.redirect('http://localhost:5173/login')
    }catch(error){
        console.error(error)
        res.sendStatus(500)

    } 
}


export const loginController= async (req,res)=>{
    try{
        const {email, password}= req.body

        //validar estos datos

        const user= await User.findOne({email: email})  //buscar usuario
        
        //comparar la passw recibida con la password hasheada
        const passwordIsValid= await bcrypt.compare(password, user.password)

        if(!user){
            const response= new ResponseBuilder()
            .setOk(false)
            .setStatus(404)
            .setMessage('El usuario no esta registrado')
            .build()

            return res.json(response)
        }

        if (!passwordIsValid){
            const response= new ResponseBuilder()
            .setOk(false)
            .setStatus(401)
            .setMessage('La password recibida no es correcta')
            .build()

            return res.json(response)
        }
        
        if (!user.emailVerified){   
            const response= new ResponseBuilder()
            .setOk(false)
            .setStatus(403)
            .setMessage('LOGIN ERROR: El email no esta verificado')
            .build()

            return res.json(response)
        }

        //crear token
        const acces_token= jwt.sign(
            {
                user_id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            ENVIRONMENT.SECRET_KEY,
            {
                expiresIn: '1d'
            }
        )

        const response= new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage('LOGGED SUCCESS!')
        .setData({
            acces_token: acces_token,
            user_info:{
                user_id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verified: user.emailVerified
            }
        })
        .build()

        return res.json(response)

    }catch(error){
        console.error(error)
    }
}


export const forgotPasswordController= async(req,res)=>{
    try{
        const {email}= req.body

        //buscar el usuario por mail
        const user= await User.findOne({email: email})

        if (!user){
            res.sendStatus(404)
        }

        const reset_token= jwt.sign(
            {
                email: user.email
            },
            ENVIRONMENT.SECRET_KEY,
            {
                expiresIn: '1d'
            }
        )
        
        const resetURL= `${ENVIRONMENT.FRONTEND_URL}/auth/recovery-password/${reset_token}`

        //enviar email con asunto recuperar passw y un link con el reseturl
        const result= await transporterEmail.sendMail({
            subject: 'Recuperar password',
            to: user.email,
            html: `
                <h1>Resetear contraseña</h1>
                <p>Para resetear tu contraseña da click <a href='${resetURL}'>AQUI</a></p>
            `
        })
        
        res.json({ok:true})
    }catch(error){
        console.error(error)
    }
}


export const recoveryPasswordController= async (req,res)=>{
    try{
        const {reset_token, form}= req.body

        const payload= jwt.verify(reset_token,ENVIRONMENT.SECRET_KEY)
        
        const user= await User.findOne({email: payload.email})

        if(!user){
            return res.status(404)
        }

        const password_hashed= await bcrypt.hash(form.password, 10)
        user.password= password_hashed
        await user.save()

        const response= new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setCode('PASSWORD_RESET_SUCCESS')
        .setMessage('Contraseña actualizada con exito!')
        
        .build()

        return res.json(response)
    }catch(error){
        res.json(error)
    }
    
}