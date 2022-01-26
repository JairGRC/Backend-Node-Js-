const db=require('../config/config')

const Category={}
Category.getAll=()=>{
    const sql=`
    select id,name,description from categories order by name
    `;
    return db.manyOrNone(sql)
    
}
Category.create=(category)=>{
    const sql=`
    Insert into categories
    (
        name,
        description,
        created_at,
        updated_at
    )
    values ($1,$2,$3,$4) returning id
    `;
    return db.oneOrNone(sql,[
        category.name,
        category.description,
        new Date(),
        new Date()
    ]);

}
module.exports=Category;