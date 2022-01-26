const JwtStrategy=require('passport-jwt').Strategy
const ExtractJwt=require('passport-jwt').ExtractJwt
const User=require('../models/user')
const Keys=require('./keys')

module.exports=function(passport){
    let opts={}
    opts.jwtFromRequest =ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey=Keys.secretOrKey
    passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
        console.log("Entro")
        User.findById(jwt_payload.id,(err,user)=>{
            if(err){
                console.log("1")
                return done(err,false)
            }
            if(user){
                console.log("2")
                return done(null,user)
            }
            else{
                console.log("3")
                return done(null,false)
            }
        })
    }))
}
