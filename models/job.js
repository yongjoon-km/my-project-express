module.exports = (sequelize, DataTypes) => {
	return sequelize.define('job_ts', {
		title: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true
		},
		user: {
			type: DataTypes.INTEGER,
			allowNull: false,
		}
	})
}