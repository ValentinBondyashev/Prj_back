const Admins = sequelize.define('admins', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    admin_firebase_id: {
        type: Sequelize.DataTypes.STRING(64)
    },
}, {
    timestamps: false
});

// Sync model;
Admins.sync();

// Export model;
module.exports = Admins;