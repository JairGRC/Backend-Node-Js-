const Category=require('../models/category')

module.exports={

    async getAll(req,res,next){
        try {
            const data= await Category.getAll()
            console.log(`Categories: ${JSON.stringify(data)}`)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message:'Hubo al obtener la categoria',
                error: error
            })
        }
    },

    async create(req,res,next){
        try {
            const category=req.body;
            console.log(`Categoria enviada: ${category}`)

            const data=await Category.create(category);
            return res.status(201).json({
                success:true,
                message:'CAtegoria creada',
                data:data.id
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message:'Hubo un error al crear la cateogria',
                error: error
            })
        }
    }
}