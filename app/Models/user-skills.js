module.exports = function (sequelize,Sequelize) {
    return sequelize.define('userSkills', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: Sequelize.STRING(32),
            allowNull: false
        },
        mark: {
            type: Sequelize.SMALLINT.UNSIGNED,
            allowNull: false
        },
        disposition: {
            type: Sequelize.SMALLINT.UNSIGNED,
            allowNull: false
        },
        comment: {
            type: Sequelize.STRING(256)
        },
        date: {
            type: Sequelize.DATEONLY,
            defaultValue: Sequelize.NOW
        },
        skillId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
}
// Add foreign keys;
