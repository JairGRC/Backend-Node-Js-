const Product = require('../models/product')
const storage=require('../utils/cloud_storage')
const asynForEach=require('../utils/async_foreach')

module.exports={
    async create(req,res,next){
        let product=JSON.parse(req.body.produtc)
        const files=req.files
        let inserts=0
        if(files.lenght===0){
            return res.status(501).json({
                success: false,
                message:'Error al registrar producto no tiene imagen'
            })
        }else{
            try {
                const data=await Product.create(product) // ALMACENANDO DATOS
                product.id=data.id

                const start=async()=>{
                    await asynForEach(files,async (file)=>{
                        const pathImage=`image_${Date.now()}`
                        const url=await storage(file,pathImage)

                        if(url!== undefined && url!==null){
                            if(inserts==0){
                                product.image1=url
                            }
                            else if(inserts==1){
                                product.image2=url
                            }
                            else if(inserts==2){
                                product.image3=url
                            }
                        }

                        await Product.update(product)
                        inserts=inserts+1
                        if(inserts===files.lenght){
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
                    message:'Error al registrar el producto'
                })
            }
        }
    }
}