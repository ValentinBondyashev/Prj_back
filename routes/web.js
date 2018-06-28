// Initialize express router;
const express = require('express');
const router = express.Router();

// Initialize middleware;
const authMiddleware = require('../app/Middleware/auth');

// Initialize routes;
const skills = require('../app/Controllers/skills');

console.log(authMiddleware);

// Add routes to router;
router.get('/skills', authMiddleware.auth, skills.getSkills);
router.get('/skills/categories', authMiddleware.auth, skills.getCategoriesSkills);
router.put('/skills', authMiddleware.auth,authMiddleware.admin, skills.addSkills);
router.post('/skills', authMiddleware.auth, skills.createNewSkill);
router.get('/skills/list', skills.getSkillsList);
router.get('/skills/all_users', authMiddleware.auth, skills.getAllUsers);
router.get('/skills/check_admin', authMiddleware.auth, skills.checkAdmin);
// Export router;
module.exports = router;