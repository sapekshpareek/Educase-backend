const express = require('express');
const router = express.Router();
const schoolController = require('../controller/schoolController');

router.get('/', (req, res) => {
    res.send('Welcome to School Management API');
});

router.get('/listSchool', schoolController.getSchools);
router.post('/addSchool', schoolController.addSchool);

module.exports = router;
