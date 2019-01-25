module.exports.admin = (req,res,next)=>{
    if(!req.session.admin){
        return res.redirect('/admin/login');
    }
    return next();
}

module.exports.student = (req,res,next)=>{
    if(!req.session.student){
        return res.redirect('/student/login');
    }
    return next();
}