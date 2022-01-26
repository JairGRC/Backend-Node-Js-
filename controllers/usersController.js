const passport = require("passport");
const User = require("../models/user");
const jwt=require('jsonwebtoken')
const keys=require('../config/keys');
const Rol = require("../models/rol");
const storage=require('../utils/cloud_storage')

module.exports={
    async getAll(req,res,next){
        try {
            const data=await User.getAll()
            console.log(`Usuarios: ${data}`)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message:'Error al obtener los usuarios'
            })
        }
    },

    async findById(req,res,next){
        try {
            const id= req.params.id
            const data=await User.findByUserID(id)
            console.log(`Usuarios: ${data}`)
            return res.status(201).json(data)
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message:'Error el usuario por ID'
            })
        }
    },

    async register(req,res,next){
        try {
            const user=req.body
            const data=await User.create(user)

            await Rol.create(data.id,1);
            return res.status(201).json({
                success:true,
                message:'El registro se realizo correctamente, Ahora inicia sesion',
                data:data.id
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message:'Error al registrar el usuario'
            })
        }
    },

    async registerwithImage(req,res,next){
        try {
            const user=JSON.parse(req.body.user)
            console.log(`Datos enviados : ${user}`)
            const files= req.files
            if(files.length>0){
                const pathImage=`image_${Date.now()}` // nombre del archivo
                const url= await storage(files[0],pathImage)
                if(url!=undefined && url!=null){
                    user.image=url
                }
            }
            const data=await User.create(user)

            await Rol.create(data.id,1);
            return res.status(201).json({
                success:true,
                message:'El registro se realizo correctamente, Ahora inicia sesion',
                data:data.id
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message:'Error al registrar el usuario'
            })
        }
    },

    async update(req,res,next){
        try {
            const user=JSON.parse(req.body.user)
            console.log(`Datos enviados : ${JSON.stringify(user)}`)
            const files= req.files
            if(files.length>0){
                const pathImage=`image_${Date.now()}` // nombre del archivo
                const url= await storage(files[0],pathImage)
                if(url!=undefined && url!=null){
                    user.image=url
                }
            }
            await User.update(user)

            return res.status(201).json({
                success:true,
                message:'LOs datos se actualizaron',
            })
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message:'Error con la actualizacion'
            })
        }
    },

    async login(req,res,next){
        try {
            const email=req.body.email
            const password=req.body.password
            const myUser=await User.findByEmail(email)

            if(!myUser){
                return res.status(401).json({
                    success: false,
                    message:'El email no fue encontrado'
                }
                )
            }
            if(User.isPasswordMarched(password,myUser.password)){
                const token=jwt.sign({id:myUser.id,email:myUser.email},keys.secretOrKey,{
                    //expiresIn:(60*60*24) //1 hora
                })
                const data={
                    id:myUser.id,
                    name:myUser.name,
                    lastname:myUser.lastname,
                    email:myUser.email,
                    phone:myUser.phone,
                    image:myUser.image,
                    session_token:`JWT ${token}`,
                    roles:myUser.roles
                }
                await User.updateToken(myUser.id,`JWT ${token}`)
                console.log(`Usuario enviado ${data}`)
                return res.status(201).json({
                    success: true,
                    data:data,
                    message:'Usuario ha sido autenticado'
                })
            }else{
                return res.status(401).json({
                    success: false,
                    message:'La contraseña es incorrecta',
                    
                })
            }
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message:'Error al momento de hacer login',
                error:error
            })
        }
    }
}