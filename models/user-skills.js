// Generate model;
const UserSkills = sequelize.define('userSkills', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: Sequelize.DataTypes.STRING(32),
        allowNull: false
    },
    mark: {
        type: Sequelize.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false
    },
    disposition: {
        type: Sequelize.DataTypes.SMALLINT.UNSIGNED,
        allowNull: false
    },
    date: {
        type: Sequelize.DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
}, {
    timestamps: false
});

// Add foreign keys;
UserSkills.belongsTo(require('./skills'), { as: 'skill' });

// Sync model;
UserSkills.sync();

// Export model;
module.exports = UserSkills;