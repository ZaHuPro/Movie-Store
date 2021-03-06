module.exports = function (sequelize, DataTypes) {
    var Movie = sequelize.define('movie', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        year_of_release: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        plot: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                notEmpty: true
            }
        },
        poster: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        timestamps: true,
        freezeTableName: true
    });

    Movie.associate = function (db) {
       db.Movie.belongsTo(db.Producer,{ foreignKey: "producer_id", sourceKey: "id" });
    }
    return Movie;
}