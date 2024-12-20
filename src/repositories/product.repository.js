import Product from "../models/products.models.js";


class ProductRepository{
    static async createProduct(new_product_data){
        const new_product= new Product(new_product_data)
        return await new_product.save()
    }

    static async updateProduct(product_id, updated_data){
        return Product.findByIdAndUpdate(product_id, updated_data)
    }

    static async getAllProducts(){
        return Product.find({active:true})
        
    }

    static async getProductById(product_id){
        return Product.findById(product_id)

    }

    static async deleteProduct(product_id){
        //el new:true indica que debe devolver el producto actualizado
        return Product.findByIdAndUpdate(product_id,{active:false},{new:true})
    }

}

export default ProductRepository