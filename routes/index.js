const {Router} = require('express')
const router = Router()

router.get('/', (req, res)=>{
    if(req.isAuthenticated()){
        res.redirect('/my-drive')
    }else{
        res.render('index')
    }
})

module.exports = router