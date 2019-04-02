const { Admin, Course, Student, Result, Exam, Hall, SittingArrangement } = require('../models');
const validateData = require('../helpers/validateData');


const getIndex = async (req,res) => {
    try {
        const students = await Student.count();
        const courses = await Course.count();
        const halls = await Hall.count();
        const admin = req.session.admin;
        const exams = await Exam.find().populate(['hall','course']);
        res.render('admin/index',{title: 'Dashboard', students, courses, halls,admin,exams});
    } catch (error) {
        console.log(error)
        res.redirect('/');
    }
}

const get_login = (req,res)=>{
    res.render('admin/login',{title:"Login"});
}

const get_signup = (req,res)=>{
    res.render('admin/signup',{title:"Sign Up"});
}

const get_courses = async(req,res) => {
    try {
        const admin = req.session.admin;
        const courses = await Course.find({},{});
        res.render('admin/courses',{title: "Add Course", courses,admin});
    } catch (error) { 
        res.send('Suhfjh');
    }
}

const get_students = async(req,res) =>{
    try {
        const student = await Student.find({},{});
        const admin = req.session.admin;
        res.render('admin/view_students',{title:"View Students", students,admin});
    } catch (error) {
        res.redirect('/admin');
    }
}

const get_enroll_student = async(req,res)=>{
    try {
        const students = await Student.find({},{});
        const admin = req.session.admin;
        const courses = await Course.find({},{});
        res.render('admin/enroll_student',{title: "Enroll Student",students,courses,admin});
    } catch (error) {
        res.redirect('/admin');
    }
}

const get_add_hall = async(req,res)=>{
    const admin = req.session.admin;
    res.render('admin/add_hall',{title: "Add Exam Hall",admin});
}

const get_halls = async(req,res) => {
    try {
        const admin = req.session.admin;
        const halls = await Hall.find();
        res.render('admin/halls',{title:"Exam Halls", halls,admin});
    } catch (error) {
        console.log(error)
    }
}

const get_course_students = async(req,res) => {
    try {
        const { course_id } = req.params;
        let students = await Student.find();

        students = students.filter((student) => {
            let check = false;
                student.courses.forEach((course) => {
                    if(course == course_id){
                        check = true;
                    }
                });
            return check;
        });
        const course = await Course.findById(course_id);
        const admin = req.session.admin;
        res.render('admin/course_students',{students, title:"Enrolled Students",admin, course});
    } catch (error) {
        
    }

}

const get_exams = async(req,res) => {
    try {
        const admin = req.session.admin;
        const exams = await Exam.find().populate(['hall','course']);
        console.log(exams)
        res.render('admin/exams',{title:"Scheduled Exams", exams,admin});
    } catch (error) {
        console.log(error)
    }
}

const get_schedule_exam = async(req,res)=>{
    try {
        const courses = await Course.find({},{});
        const halls = await Hall.find({},{});
        const admin = req.session.admin;
        res.render('admin/schedule_exam',{title: "Schedule Exam",courses,halls,admin});
    } catch (error) {
        res.redirect('/admin');
    }
}

const get_add_result = async(req,res)=>{
    try {
        const students = await Student.find({},{});
        const courses = await Course.find({},{});
        const admin = req.session.admin;
        res.render('admin/add_result',{title: "Add Student Result",admin,students,courses});
    } catch (error) {
        res.redirect('/admin');
    }
}

const get_student_courses = async(req,res)=>{
    try {
        const {student_id } = req.params;
        const student = Student.findById(student_id);
        const admin = req.session.admin;
        if(student){
            const courses = student.courses;
            res.json({status:1,message:courses});
        }
    } catch (error) {
        res.json({status:0,message:"Unable to Fetch Student Courses"})
    }
}


const authenticate = (req,res)=>{
    const { email, password } = req.body;
    if(!validateData(email,password)){
        res.json({status:0,message:"Please fill all fields!"});
    }else{
        Admin.findOne({email,password}).then((admin)=>{
            if(admin){
                req.session.admin = admin;
                res.json({status:1,message:"Login Successful, We are redirecting you..."});
            }else{
                res.json({status:0,message:"Sorry, Invalid Login email or password"});
            }
        }).catch((err)=>{
            res.json({status:0,message:"Sorry, An Error occured!"});
        });
    }
}

const create_admin = async(req,res)=>{
    console.log(req.body);
    const { firstname, lastname, email, password, gender} = req.body;
    if(!validateData(firstname, lastname, email, password, gender)){
        res.json({status:0,message:"Please fill all fields!"});
    }else{
        try {
            const admin = await Admin.findOne({email});
            if(admin){
                res.json({status:0,message:"Sorry, Admin user Exists Already!"});
            }else{
                const new_admin = await Admin.create(req.body);
                res.json({status:1,message:"Great, Registration Successful"});
            }
        } catch (error) {
            res.json({status:0,message:error});
        }
        
    }
}

const add_course = async(req,res)=>{
    console.log(req.body);
    const { title, code, level } = req.body;
    if(!validateData(title,code, level)){
        res.json({status:0,message:"Please fill all fields!"});
    }else{
        try {
            const course = await Course.findOne({code});
            if(course){
                res.json({status:0,message:"Sorry, Course Exists Already!"});
            }else{
                const new_course = await Course.create(req.body);
                res.json({status:1,message:"Course Created Successfully"});
            }
        } catch (error) {
            res.json({status:0,message:error});
        }
    }
}

const view_students = async(req,res)=> {
    try {
        const students = await Student.find({},{});
        const admin = req.session.admin;
        if(students){
            res.render('admin/view_students',{title:"View Students",students,admin});
        }
    } catch (error) {
        let backURL=req.header('Referer') || '/';
        res.redirect(backURL);
    }
} 

const enroll_student = async(req,res)=> {
    
    const {student_id, courses} = req.body;
    // console.log(stud);
    if(!validateData(student_id, courses)){
        res.json({status:0,message:"Please fill all fields!"});
    }else{
        try {
            // find students
            const student = await Student.findOne({_id:student_id});
            if(student){
                courses.forEach(async course => {
                    console.log(courses.indexOf(course))
                    if(courses.indexOf(course) == 1){
                        student.courses.push(course);
                        const course_d = await Course.findById(course);
                        course_d.students++;
                        await course_d.save();
                    }
                });
                console.log(student);
                await student.save();
                res.json({status:1,message: "Student Enrolled Successfully"});
            }else{
                res.json({status:0,message:"Student Not Found"});
            }
            
        } catch (error) {
            console.log(error)
            res.json({status:0,message:error});
        }
    }
}

const add_result = async(req,res)=>{
    const { student, course, score } = req.body;
    if(!validateData(student, course, score)){
        res.json({status:0,message:"Please fill all fields!"});
    }else{
        try {
            const result = await Result.create(req.body);
            if(result){
                res.json({status:1,message:"Result Added Successfully"});
            }
        } catch (error) {
            res.json({status:0,message:error});
        }
    }
}

const schedule_exam = async(req,res)=>{
    console.log(req.body);
    const { course, hall, invigilator, date} = req.body;
    if(!validateData(course, hall, invigilator, date)){
        res.json({status:0,message:"Please fill all fields!"});
    }else{
        try {
            const exam = await Exam.findOne({course});
            if(exam){
                res.json({status:0,message:"Selected Course Exam Exist Already"});
            }else{
                const newexam = await Exam.create(req.body);
                if(newexam){
                    res.json({status:1,message:"Exam Schedule Created  Successfully"});
                }
            }
        } catch (error) {
            res.json({status:0,message:error});
        }
    }
}

const add_hall = async(req,res)=>{
    const { name, rows, cols, seats_per_col } = req.body;
    if(!validateData(name, rows, cols, seats_per_col)){
        res.json({status:0,message:"Please fill all fields!"});
    }else{
        try {
            const hall = await Hall.create(req.body);
            if(hall){
                res.json({status:1,message:"Exam Hall Added  Successfully"});
            }
        } catch (error) {
            res.json({status:0,message:error});
        }
    }
};
const generate_sitting_arrangment = async(req,res) => {
    try {
        // console.log('ggg')
        const { exam } = req.params;
        // console.log(req);
        // check if arrangement exists before
        const arrangement = await SittingArrangement.findOne({exam});
        const exam_detail = await Exam.findById(exam).populate('hall');
        const course = await Course.findById(exam_detail.course);

        const admin = req.session.admin;
        if(!arrangement){
            // get exam details

            const hall = exam_detail.hall;
            let exam_size = parseInt(hall['rows'] * hall['cols']* hall['seats_per_col']);
            if(exam_detail){
                let students_matric = [];
                // get level of students writing the exam from the course details

                const students = await Student.find().select(['courses','matric','firstname','lastname']);
                let enrolled = course.students;
                const ratio = (enrolled/exam_size);
                exam_size = exam_size *ratio;
                let seats = [];
                let seatArr = Array(exam_size).fill(0).map((e,i) => i+1);
                console.log(seatArr);
                students.forEach((student) => {
                    if(student.courses.indexOf(exam_detail.course) !== -1){
                        let index = Math.floor(Math.random() * seatArr.length);
                        console.log(index);
                        let seatNumber = seatArr[index];
                        students_matric.push({
                            "seatNumber" : seatNumber,
                            "matricNumber" : student.matric,
                            "name" : `${student.firstname} ${student.lastname}`
                        });
                        seatArr.splice(index,1);
                        console.log('seat array ', seatArr);
                    }
                });
                const newArrangement = new SittingArrangement({
                    exam,
                    arrangement: students_matric
                });
                await newArrangement.save();
                // shuffle array
                // students_matric = shuffle(students_matric);
                res.render('admin/sitting_arrangement',{title:"Sitting Arrangement",students: students_matric, course ,admin,seats:hall.seats_per_col});
            }else{
                console.log('not available');
            }
        }else{
            res.render('admin/sitting_arrangement',{title:"Sitting Arrangement",students: arrangement.arrangement, course ,admin});
        }

        
    } catch (error) {
        console.log(error);
    }
};

// Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

const logout = (req,res) => {
    req.session.destroy();
    res.redirect('/admin/login');
}

module.exports = {
    getIndex,
    get_login,
    get_signup,
    get_courses,
    get_enroll_student,
    get_add_hall,
    get_add_result,
    get_schedule_exam,
    get_student_courses,
    authenticate,
    create_admin,
    add_course,
    view_students,
    enroll_student,
    add_result,
    schedule_exam,
    add_hall,
    get_halls,
    get_exams,
    generate_sitting_arrangment,
    get_course_students,
    logout
}