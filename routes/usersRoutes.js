const usersController = require("../controllers/usersController");
const passport=require('passport')

module.exports=(app,upload)=>{
    app.get('/api/users/getAll',usersController.getAll)
    app.get('/api/users/findById/:id',usersController.findById)

    app.post('/api/users/create',upload.array('image',1),usersController.registerwithImage)

    app.post('/api/users/login',usersController.login)

    // RUTAS PARA ACTUALIZAR DATOS 
    app.put('/api/users/update',upload.array('image',1),usersController.update)
}