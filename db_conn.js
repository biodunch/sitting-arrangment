const mongoose = require('mongoose');
// console.log(process.env.NODE_ENV);
const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds117145.mlab.com:17145/sitting`;

mongoose.connect(url).then(()=>{
    console.log('Connected to database',{ useNewUrlParser: true });
}).catch((err)=>{
    console.log(err);
});