const express = require('express');
const router = express.Router();
const controller = require('../controllers/AdminController');
const csrf = require('csurf');
const ensureloggedIn = require('../middlewares/ensureLoggedIn').admin;

const csrfProtection = csrf({ cookie: true })

router.get('/login',controller.get_login);

router.post('/login',controller.authenticate);

router.get('/signup',controller.get_signup);

router.post('/signup',controller.create_admin);

router.use(ensureloggedIn);

router.get('/courses',controller.get_courses);

router.post('/add_course',controller.add_course);

router.get('/view_students',controller.view_students);

router.get('/enroll_student',controller.get_enroll_student);

router.post('/enroll_student',controller.enroll_student);

router.get('/add_hall',controller.get_add_hall);

router.post('/add_hall',controller.add_hall);

router.get('/schedule_exam',controller.get_schedule_exam);

router.post('/schedule_exam',controller.schedule_exam);

router.get('/add_result',controller.get_add_result);

router.post('/add_result',controller.add_result);

router.get('/exam_halls',controller.get_halls);

router.get('/scheduled_exams',controller.get_exams);

// router.get('/exams',controller.get_exams);

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.render('admin/index',{title: 'Dashboard'});
});

module.exports = router;
