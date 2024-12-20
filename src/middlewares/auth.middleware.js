import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/environment.js'
import AppError from '../helpers/errors/app.error.js'

//logica para autorizar personas segun su role
//autorizar a hacer acciones con los productos
const authMiddleware= (roles_permitidos)=>{ 
    return (req, res, next)=>{
        try{
            //Este header generalmente tiene informacion de la autorizacion
            const auth_header= req.headers['authorization'] //'Bearer token_value'

            if(!auth_header){
                return res.json({message: 'Falta el token de autorizacion'})
            }

            //'Bearer token_value'.split(' ') => ['Bearer','token_value']
            const access_token= auth_header.split(' ')[1]

            if(!access_token){
                return res.json({message: 'El token de autorizacion esta mal formado'})
            }

            const user_session_payload_decoded= jwt.verify(access_token, ENVIRONMENT.SECRET_KEY)

            if(!roles_permitidos.includes(user_session_payload_decoded.role)){
                return res.json({message: 'No tienes permiso para realizar esta operacion', status: 403})
            }

            //guardamos en el objeto request informacion de sesion del usuario
            req.user= user_session_payload_decoded

            next()
        }catch(error){
            res.sendStatus(500)
        }
    }
}


export default authMiddleware
