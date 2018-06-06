// Initialize express router;
const express = require('express');
const router = express.Router();

// Initialize middleware;
const authMiddleware = require('./middleware/auth');

// Initialize routes;
const skills = require('./routes/skills');
const test = require('./routes/test');

// Add routes to router;
router.get('/skills/', authMiddleware, skills.getSkills);
router.put('/skills/', authMiddleware, skills.addSkills);
router.post('/skills/', authMiddleware, skills.createNewSkill);
router.get('/skills/list', skills.getSkillsList);
router.get('/test', test.test);

// Export router;
module.exports = router;