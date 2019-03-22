const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt-nodejs');

// UserSchema
const AdminSchema = new Schema({
    firstname: { type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true},
    password: { type: String, required: true},
    gender: { type: String, enum:['male','female'], required:true}
});
const Admin = mongoose.model('admin',AdminSchema);

const CourseSchema = new Schema({
    title: { type: String, required: true},
    code: {type: String, required: true, unique:true},
    level: { type:String, enum:['100','200','300','400'], required:true},
    students: {type: Number, default:0}
});
const Course = mongoose.model('Course',CourseSchema);

const StudentSchema = new Schema({
    firstname: { type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true,unique:true},
    gender: { type: String, enum:['male','female'], required:true},
    level: { type:String, enum:['100','200','300','400'], required:true},
    matric: { type: String,minlength:6,required:true},
    courses:[{type:Schema.Types.ObjectId, ref: 'Course'}]
    // barcode: { type: }
});
const Student = mongoose.model('Student',StudentSchema);


const HallSchema = new Schema({
    name: { type: String, required:true},
    rows: { type: Number, required:true},
    cols: { type: Number, required: true},
    seats_per_col: { type: Number, required: true}
});
const Hall = mongoose.model('Hall',HallSchema);

const ExamSchema = new Schema({
    course: { type: Schema.Types.ObjectId,ref:'Course', required:true},
    hall: { type: Schema.Types.ObjectId,ref:'Hall', required:true},
    invigilator: { type: String, required:true},
    date: { type: Date, required: true}
})
const Exam = mongoose.model('Exam',ExamSchema);

const ResultSchema = new Schema({
    student: {type: Schema.Types.ObjectId,ref:'Student', required:true},
    course: {type: Schema.Types.ObjectId,ref:'Course', required:true},
    score: { type: Number, required: true}
});
const Result = mongoose.model('Result',ResultSchema);

const SittingArrangementSchema = new Schema({
    exam: { type: Schema.Types.ObjectId, ref:'Exam', required:true },
    arrangement: {type: Array, required: true }
}, { timestamps: true });
const SittingArrangement = mongoose.model('SittingArrangement',SittingArrangementSchema);

module.exports = {
    Admin,
    Course,
    Student,
    Hall,
    Exam,
    Result,
    SittingArrangement
};