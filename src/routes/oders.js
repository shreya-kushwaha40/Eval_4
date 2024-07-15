const express = require('express');
const Order = require('../models/order');
const eventEmitter = require('../app').eventEmitter;

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    eventEmitter.emit('orderPlaced', order);
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
