const express= require('express')

const router= express.Router()

router.get('/', (req, res)=>{
    res.status(200).send('Xin chào, tôi là Bocchi Bot')
})

module.exports=router