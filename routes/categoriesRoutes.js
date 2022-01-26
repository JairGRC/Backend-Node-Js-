const CategoriesController= require('../controllers/categoryController')

module.exports=(app)=>{
    /* POST ROUTES */
    app.post('/api/categories/create',CategoriesController.create);

    /* GET ROUTES */ 
    app.get('/api/categories/getAll',CategoriesController.getAll);

}