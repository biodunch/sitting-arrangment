const express = require('express');
const router = express.Router();
const faker = require('faker');
const randomize = require('randomatic');
const Student = require('../models/index').Student;

router.post('/student/:num',async (req,res) => {
    const { num } = req.params;
    for (let i = 0; i < num; i++){
        const firstname = faker.name.firstName();
        const lastname = faker.name.lastName();
        const email = faker.internet.email();
        const genders = ['male', 'female'];
        const levels = ['100','200','300','400'];
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const level = levels[Math.floor(Math.random() * levels.length)];
        const matric = randomize('0',6);
        const newStudent =  new Student({
            firstname,
            lastname,
            email,
            gender,
            level,
            matric,
        });
        await newStudent.save();
    }
    res.send("seeding Complete");
})

module.exports = router;