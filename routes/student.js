var express = require('express');
var router = express.Router();
const controller = require('../controllers/StudentController');
const ensureLoggedIn  = require('../middlewares/ensureLoggedIn').student;


router.get('/login',controller.get_login);

router.get('/signup',controller.get_signup);

router.post('/login',controller.authenticate_student);

router.post('/signup',controller.create_student);

router.use(ensureLoggedIn);

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  const current_student = req.session.student;
  res.render('student/index',{title: 'Dashboard', current_student});
}); 


router.get('/courses',controller.get_courses);

router.get('/edit_profile',controller.get_edit_profile);

router.get('/result',controller.get_view_result);

// router.get('/write_exam',controller.wri)

// router.get('/get_exams',controller.get_exams);

router.get('/exams',controller.get_scheduled_exams);

router.get('/write_exam',controller.get_exams);




module.exports = router;
