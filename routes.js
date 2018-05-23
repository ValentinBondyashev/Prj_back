// Initialize express router;
const express = require('express');
const router = express.Router();

// Initialize middleware;
const authMiddleware = require('./middleware/auth');

// Initialize routes;
const skills = require('./routes/skills');

// Add routes to router;
router.get('/skills/', authMiddleware, skills.getSkills);
router.put('/skills/', authMiddleware, skills.addSkills);
router.get('/skills/list', skills.getSkillsList);

// Export router;
module.exports = router;