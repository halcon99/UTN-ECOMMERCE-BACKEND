const errorHandlerMiddleware= (error, req, res, next)=>{
    error.status_code= error.status_code || 500
    error.status= error.status || 'error'

    if(error.is_operational){
        return res.json({status: error.status, message: error.message})
    }

    console.error('Error: ', error)
    
    return res.status(500).json({status: 'error', message: 'Ocurrio un error inesperado'})
}

export default errorHandlerMiddleware