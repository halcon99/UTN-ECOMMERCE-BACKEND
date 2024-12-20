//Logica de conexion con la database
import mongoDB from "mongoose"
import ENVIRONMENT from "./environment.js"

const MONGO_URL= ENVIRONMENT.MONGO_DB_CONNECTION_STR +'/'+ ENVIRONMENT.MONGO_DB_DATABASE

mongoDB.connect(MONGO_URL, {})
.then(      //una vez se conecta con la db se ejecuta el then
    ()=>{
        console.log('Se establecio la conexion con mongoDB')
    }
)
.catch(
    (error)=>{
        console.log('La conexion con mongoDB fallo', error)
    }
)
.finally(
    ()=>{
        console.log('El proceso de conexion con la db a finalizado')
    }
)

export default mongoDB