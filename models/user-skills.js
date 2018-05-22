// Generate model;
const UserSkills = sequelize.define('skills', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.DataTypes.STRING(32)
    },
    skillId: {
        type: Sequelize.DataTypes.INTEGER
    },
    mark: {
        type: Sequelize.DataTypes.INTEGER(4)
    },
    date: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false
});

// Sync model;
UserSkills.sync();

// Export model;
module.exports = UserSkills;