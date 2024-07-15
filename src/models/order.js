const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./customer');



const Order = sequelize.define('Order', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    customerId:{
        type: DataTypes.INTEGER,
        references:{
            model: Customer,
            key: 'id',
        },
    },
    orderDate:{
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending',
    },
})

Customer.hasMany(Order);
Order.belongsTo(Customer);

module.exports = Order;