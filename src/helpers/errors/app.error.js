//los errores seran de codigo o database y los fails son de validaciones o no se encontro producto
class AppError extends Error{
    constructor(message, status_code){
        super(message)
        this.status_code= status_code
        this.status= String(status_code).startsWith('4') ? 'fail' : 'error'

        //errores operacionales(que pasan al frontend)
        //los que mostramos al usuario
        this.is_operational= true

        //capturar la traza del error
        Error.captureStackTrace(this, this.constructor)
    }
}

export default AppError