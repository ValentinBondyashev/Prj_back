// Generate model;
const Skills = sequelize.define('skills', {
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

// Add foreign keys;
Skills.belongsTo(require('./skills-categories'), { as: 'category' });

// Sync model;
Skills.sync();

// Export model;
module.exports = Skills;