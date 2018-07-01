let fs = require('file-system');
let path = require('path');
let Sequelize = require("sequelize");
let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});
let db = {};


fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        let model = sequelize.import(path.join(__dirname, file));

        db[model.name] = model;
    });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.users.hasMany(db.userSkills, {foreignKey:'userId'});
db.users.hasMany(db.user_skills_logs, {foreignKey: 'userId'});

db.skills.belongsTo(db.skillsCategories, { foreignKey: 'categoryId' });
db.userSkills.belongsTo(db.users, {foreignKey: 'userId'});
db.userSkills.belongsTo(db.skills, { foreignKey: 'skillId' });

db.userSkills.hasMany(db.user_skills_logs, {foreignKey: 'skillId'});
db.user_skills_logs.belongsTo(db.userSkills, {foreignKey: 'skillId'});
db.user_skills_logs.belongsTo(db.users, {foreignKey: 'userId'});

module.exports = db;