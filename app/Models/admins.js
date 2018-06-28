module.exports = function (sequelize,Sequelize) {

    return sequelize.define('admins', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        admin_firebase_id: {
            type: Sequelize.STRING(64)
        },
    }, {
        timestamps: false
    });
}