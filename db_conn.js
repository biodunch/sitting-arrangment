const mongoose = require('mongoose');
const local_url = "mongodb://localhost/sitting";

mongoose.connect(local_url).then(()=>{
    console.log('Connected to database',{ useNewUrlParser: true });
}).catch((err)=>{
    console.log(err);
});
