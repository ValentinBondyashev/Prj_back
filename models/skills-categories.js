// Generate model;
const SkillsCategories = sequelize.define('skillsCategories', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.DataTypes.STRING(64)
    },
    description: {
        type: Sequelize.DataTypes.STRING(256)
    },
    date: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false
});

// Sync model;
SkillsCategories.sync();

// Export model;
module.exports = SkillsCategories;