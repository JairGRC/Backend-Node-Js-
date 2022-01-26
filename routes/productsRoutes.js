const ProductsController=require('../controllers/productsController')

module.exports=(app,upload)=>{

    // 
    app.post('/api/products/create',upload.array('image',3),ProductsController.create)

    app.get('/api/products/findByCategory/:id_category',ProductsController.findByCategory)
}