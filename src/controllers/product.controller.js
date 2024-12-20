import AppError from "../helpers/errors/app.error.js";
import Product from "../models/products.models.js";
import ProductRepository from "../repositories/product.repository.js";

//logica de controladores

export const createProductController= async (req, res)=>{
    try{
        const {new_product}= req.body

        if(!new_product){
            return res.status(400).json({message: 'Debe ingresar todos los datos del producto'})
        }

        const product_already_exist= await Product.findOne({title: new_product.title})
        if(product_already_exist){
            return res.status(400).json({message: 'El producto ya existe'})
        }

        const product= await ProductRepository.createProduct({...new_product, seller_id: req.user.user_id})
        return res.status(200).json(product)
    }catch(error){
        console.error(error)
        return res.status(500).json({message:"Error al crear el producto"})
    }
}


export const deleteProductController= async (req, res)=>{
    try{
        const {product_id}= req.params
        if(!product_id){
            return res.status(400).json({message: 'Debe ingresar un id valido'})
        }

        const product= await ProductRepository.deleteProduct(product_id)
        if(product){
            return res.status(200).json({message: 'Producto eliminado correctamente'})
        }else{
            return res.status(404).json({message: 'Producto no encontrado'})
        }

    }catch(error){
        console.error(error)
        return res.status(500).json({message: 'Error al eliminar producto'})
    }

}   

export const updateProductController= async (req,res)=>{
    try{
        const {product_id}= req.params
        const {updated_data}= req.body

        if(!product_id){
            return res.status(400).json({message: 'Debe ingresar un id valido'})
        }
        if(!updated_data){
            return res.status(400).json({message: 'Debe ingresar los datos para actualizar el producto'})
        }

        const updatedProduct= await ProductRepository.updateProduct(product_id, updated_data)

        if(updatedProduct){
            return res.status(200).json({message: 'Producto actualizado correctamente'})
        }else{
            return res.status(404).json({message: 'El producto no fue encontrado'})
        }
    }catch(error){
        console.error(error)
        return res.status(500).json({message: 'Error al actualizar el producto'})
    }
}


export const getProductByIdController= async (req, res, next)=>{
    try{
        const {product_id}= req.params
        if(!product_id){
            return next(new AppError('El product id no es valido', 400))
            //return res.status(400).json({message: 'Debe ingresar un id valido'})
        }

        const product= await ProductRepository.getProductById(product_id)
        if(product){
            return res.status(200).json({
                ok: true,
                message: 'Producto obtenido',
                payload: {
                    product: product
                }
            })
        }else{
            //Puedo pasarle a next el parametro para x middleware
            return next(new AppError('Producto no encontrado', 404))
            //return res.status(404).json({message:'Producto no encontrado'})
        }
    }catch(error){
        next(error)
        //console.error(error)
        //return res.status(500).json({message: 'Error al obtener producto por id'})
    }
}


export const getAllProductsController= async(req,res)=>{
    try{
        const products= await ProductRepository.getAllProducts()
        return res.status(200).json({
            payload: {
                ok: true,
                products
            }
        })

    }catch(error){
        console.error(error)
        return res.status(500).json({
            ok: false,
            error: 'Hubo un error al obtener los productos',
            message: 'Error al obtener los productos'
        })
    }

}