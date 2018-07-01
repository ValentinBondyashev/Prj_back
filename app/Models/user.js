module.exports = function (sequelize,Sequelize) {
    return sequelize.define('users', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING(64)
        },
        email: {
            type: Sequelize.STRING(256),
            unique: true 
        },
        password: {
            type: Sequelize.STRING(256),
            get(){
                
            } 
        },
        role: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        timestamps: false
    });
}
