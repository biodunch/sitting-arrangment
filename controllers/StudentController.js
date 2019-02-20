const { Course, Student, Result, Exam } = require('../models');
const validateData = require('../helpers/validateData');
const bcrypt = require('bcrypt-nodejs');

const get_login = (req,res)=>{
    res.render('student/login',{title:"Login"});
}

const get_signup = (req,res)=>{
    res.render('student/signup',{title:"Sign Up"});
}
// authenticate student
const authenticate_student = (req,res)=>{
    const { email, matric } = req.body;
    if(!validateData(email,matric)){
        res.json({status:0,message:"Please fill all fields!"});
    }else{
        Student.findOne({email,matric}).then((student)=>{
            if(student){
                req.session.student = student;
                res.json({status:1,message:"Login Successful, We are redirecting you..."});
            }else{
                res.json({status:0,message:"Invalid Student Details"});
            }
            
        }).catch((err)=>{
            res.json({status:0,message:"Sorry, An Error occured!"});
        });
    } 
}


// register student
const create_student = async(req,res)=>{
    const { firstname, lastname, email, gender, matric, level} = req.body;
    if(!validateData(firstname, lastname, email, gender, matric, level)){
        res.json({status:0,message:"Please fill all fields!"});
    }else{
        try {
            const student = await Student.findOne({email,matric});
            if(student){
                res.json({status:0,message:"Sorry, Student user Exists Already!"});
            }else{
                const new_student = await Student.create(req.body);
                res.json({status:1,message:"Great, Registration Successful"});
            }
        } catch (error) {
            res.json({status:0,message:error});
        }
    }
}

const get_edit_profile = async(req,res) =>{
    try {
        const current_student = req.session.student;
        const student = await Student.findById(req.session.student._id);
        res.render('student/edit_profile',{title: "Edit Profile", student, current_student});
    } catch (error) {
        console.log(error)
    }
}

// view result
const view_result = async(req,res)=>{
    const { student } = req.params;
    try {
        const current_student = req.session.student;
        const result = await Result.find({student, current_student});
        res.render('page',{result});
    } catch (error) {
        let backURL=req.header('Referer') || '/';
        res.redirect(backURL);
    }
}

const get_view_result = async(req,res)=>{
    const student  = req.session.student;
    try {
        if(student){
            const current_student = req.session.student;
            const results = await Result.find({student: student._id}).populate('course');
            res.render('student/result',{title:"View Result",results, current_student}); 
        }else{
            console.log('jhgjgh'); 
        }
    } catch (error) {
        console.log(error);
    }
}
// edit profile
const edit_profile = async(req,res)=>{
    
}

const get_courses = async (req,res) =>{
    try {
        const current_student = req.session.student;
        const student = await Student.findById(current_student._id).populate('courses');
        console.log(student)
        if(student.courses.length == 0){
            const courses = [];
            res.render('student/courses',{courses: courses,title: "My Courses", current_student})
        }else{
            const courses = student.courses;
            res.render('student/courses',{courses: courses,title: "My Courses", current_student});
        }
    } catch (error) {
        console.log(error);
    }
}
// course details
const course_details = async(req,res)=>{
    try {
        const { course } = req.params;
        if(course){
            const course_details = await Course.findById(course);
            const current_student = req.session.student;
            if(course_details){
                res.render('student/course_details',{title:"Course Details", course_details, current_student});
            }else{
                
            }
        }else{

        }
    } catch (error) {
        console.log(error);
    }
}
// write exam
const write_exam = async(req,res)=>{
    // get exam seat number and genarate barcode
    const { exam_id } = req.params;
    try {
        const exam = await Exam.findById(exam_id);
    } catch (error) {
        
    }
}

const get_exams = async(req,res) => {
    try {
        const exams = await Exam.find().populate(['course','hall']);
        const student = await Student.findById(req.session.student._id);
        const current_student = req.session.student;
        exams.filter((exam) => {
            return student.courses.includes(exam.courses);
        });
        console.log(exams);
        res.render('student/exams',{ title:'Exams',exams, current_student});
    } catch (error) {
        console.log(error);
    }   
}

const get_scheduled_exams = async (req,res) => {
    try {
        const courses = Student.findById(req.session.student._id).populate('courses',Course).exec();
        const studentExams = [];
        if(courses.length > 0){
            courses.forEach( async(course)=>{
                const exam = await Exam.find({course});
                studentExams.push(exam);
            })
        }
        const current_student = req.session.student;
        res.render('student/exams',{title:"Scheduled Exams", studentExams, current_student});
    } catch (error) {
        console.log(error);
    }
}
// send query

module.exports = {
    get_login,
    get_signup,
    create_student,
    view_result,
    authenticate_student,
    get_view_result,
    get_courses,
    get_edit_profile,
    course_details,
    get_scheduled_exams,
    get_exams
}

