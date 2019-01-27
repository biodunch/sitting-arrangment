const express = require('express');
const router = express.Router();
const { User } = require('../models/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sitting Arrangment' });
});

router.get('/login',function(req,res,next){
  res.render('login',{title:"Login"});
})

router.post('/login',(req,res,next)=>{
  console.log(req.body);
  res.send(req.body);
})

router.get('/test_integration',(req,res,next)=>{
  return res.json({status:1,message:{username:"Hybeecodes",gender:"male",phone_number:"09032559681"}});
})

router.post('/test_integration',(req,res,next)=>{
  
})


module.exports = router;
