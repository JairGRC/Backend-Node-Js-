const Product = require('../models/product')
const storage=require('../utils/cloud_storage')
const asyncForEach=require('../utils/async_foreach')

module.exports={

    async findByCategory(req,res,next){
        try {
            const id_category=req.params.id_category // CLIENTE
            const data= await Product.findByCategory(id_category)

            return res.status(201).json(data)

        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message:'Error al listar los productos por categoria',
                error:error
            })
        }
    },


    async create(req,res,next){
        let product=JSON.parse(req.body.product)
        console.log(`Producto ${JSON.stringify(product)}`)
        const files=req.files
        let inserts=0
        if(files.lenght===0){
            return res.status(501).json({
                success: false,
                message:'Error al registrar producto no tiene imagen'
            })
        }else{
            try {
                console.log(`INGRESO A DATOS `)
                const data=await Product.create(product) // ALMACENANDO DATOS
                product.id=data.id

                const start=async()=>{
                    console.log(`Dentro de metodo start `)
                    await asyncForEach(files,async (file)=>{
                        const pathImage=`image_${Date.now()}`
                        const url=await storage(file,pathImage)

                        if(url!== undefined && url!==null){
                            if(inserts==0){
                                console.log(`Guardando URL `)
                                product.image1=url
                            }
                            else if(inserts==1){
                                console.log(`Guardando URL2 `)
                                product.image2=url
                            }
                            else if(inserts==2){
                                console.log(`Guardando URL3 `)
                                product.image3=url
                            }
                        }

                        await Product.update(product)
                        inserts=inserts+1
                        console.log(`Despues del insert : ${inserts}`)

                        console.log(`Despues del files : ${files.length}`)
                        if(inserts===files.length){
                            return res.status(201).json({
                                success:true,
                                message:'El producto se ha registrado correctamente'
                            })
                        }
                    })
                }
                start();
            } catch (error) {
                console.log(`Error: ${error}`)
                return res.status(501).json({
                    success: false,
                    message:'Error al registrar el producto',
                    error:error
                })
            }
        }
    }
}