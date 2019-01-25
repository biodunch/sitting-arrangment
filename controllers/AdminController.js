const { Admin, Course, Student, Result, Exam, Hall } = require('../models');
const validateData = require('../helpers/validateData');
const bcrypt = require('bcrypt-nodejs');


const get_login = (req,res)=>{
    res.render('admin/login',{title:"Login"});
}

const get_signup = (req,res)=>{
    res.render('admin/signup',{title:"Sign Up"});
}

const get_courses = async(req,res) => {
    try {
        const courses = await Course.find({},{});
        res.render('admin/courses',{title: "Add Course", courses});
    } catch (error) {
        res.send('Suhfjh');
    }
}

const get_students = async(req,res) =>{
    try {
        const student = await Student.find({},{});
        res.render('admin/view_students',{title:"View Students", students});
    } catch (error) {
        res.redirect('/admin');
    }
}

const get_enroll_student = async(req,res)=>{
    try {
        const students = await Student.find({},{});

        const courses = await Course.find({},{});
        res.render('admin/enroll_student',{title: "Enroll Student",students,courses});
    } catch (error) {
        res.redirect('/admin');
    }
}

const get_add_hall = async(req,res)=>{
    res.render('admin/add_hall',{title: "Add Exam Hall"});
}

const get_halls = async(req,res) => {
    try {
        const halls = await Hall.find();
        res.render('admin/halls',{title:"Exam Halls", halls});
    } catch (error) {
        console.log(error)
    }
}

const get_exams = async(req,res) => {
    try {
        const exams = await Exam.find().populate(['hall','course']);
        console.log(exams)
        res.render('admin/exams',{title:"Scheduled Exams", exams});
    } catch (error) {
        console.log(error)
    }
}

const get_schedule_exam = async(req,res)=>{
    try {
        const courses = await Course.find({},{});
        const halls = await Hall.find({},{});
        res.render('admin/schedule_exam',{title: "Schedule Exam",courses,halls});
    } catch (error) {
        res.redirect('/admin');
    }
}

const get_add_result = async(req,res)=>{
    try {
        const students = await Student.find({},{});
        res.render('admin/add_result',{title: "Add Student Result"});
    } catch (error) {
        res.redirect('/admin');
    }
}

const get_student_courses = async(req,res)=>{
    try {
        const {student_id } = req.params;
        const student = Student.findById(student_id);
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
        if(students){
            res.render('admin/view_students',{title:"View Students",students});
        }
    } catch (error) {
        let backURL=req.header('Referer') || '/';
        res.redirect(backURL);
    }
} 

const enroll_student = async(req,res)=> {
    
    const {student_id, courses} = req.body;
    // console.log(stud);
    if(!validateData(student_id)){
        res.json({status:0,message:"Please fill all fields!"});
    }else{
        try {
            // find students
            const student = await Student.findOne({_id:student_id});
            if(student){
                courses.forEach(course => {
                    if(!courses.includes(course)){
                        student.courses.push(course);
                    }
                    
                });
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
}

const generate_sitting_arrangment = async(req,res) => {
    try {
        const { exam_id } = req.params.exam;
        // get exam details
        const exam = await Exam.findById(exam_id);
        if(exam){
            // get level of students writing the exam from the course details
            const course = await Course.findById(exam.course);
            if(course){
                const student_level = course.level;
                // fetch students in the level
                const students = Student.find({level: student_level}).select('matric');

            }
        }else{

        }
        
    } catch (error) {
        
    }
    
}

module.exports = {
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
    get_exams
}