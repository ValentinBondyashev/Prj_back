// Initialize express router;
const express = require('express');
const router = express.Router();

// Initialize middleware;
const authMiddleware = require('../app/Middleware/auth');

// Initialize routes;
const skills = require('../app/Controllers/skills');

const UserController = require('./../app/Controllers/UserController');
	 

router.post('/register', UserController.register);
router.post('/login', UserController.login);

// router.post('/dbinsert', UserController.userSkillsInsert);
// Add routes to router;

router.get('/skills/categories', authMiddleware.auth, skills.getCategoriesSkills);
router.put('/skills', authMiddleware.auth.bind(authMiddleware),authMiddleware.admin, skills.addSkills);
router.post('/skills', authMiddleware.auth, skills.createNewSkill);
router.get('/skills/list', skills.getSkillsList);
router.get('/skills/all_users', skills.getAllUsers);
router.get('/skills/check_admin', authMiddleware.auth, UserController.isAdmin);
router.get('/skills/matched',authMiddleware.auth.bind(authMiddleware),authMiddleware.admin, skills.matched);

router.get('/skills/:id', authMiddleware.auth.bind(authMiddleware),authMiddleware.admin, skills.getSkills);
// Export router;
module.exports = router;