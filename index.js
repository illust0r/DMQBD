const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MySQL
const sequelize = new Sequelize('accounting_app', 'fzw', '020122', {
  host: 'localhost',
  dialect: 'mysql',
});

// Transaction model.

const Transaction = sequelize.define('Transaction', {
  description: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.DOUBLE,
  },
  type: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
  date: {
    type: DataTypes.DATE,
  },
});

Transaction.sync();

// API routes
app.get('/transactions', async (req, res) => {
  const transactions = await Transaction.findAll();
  res.json(transactions);
});

app.post('/transactions', async (req, res) => {
  const transaction = await Transaction.create(req.body);
  res.json(transaction);
});

app.delete('/transactions/:id', async (req, res) => {
  await Transaction.destroy({ where: { id: req.params.id } });
  res.json({ message: 'Transaction deleted' });
});

// Start server
const port = 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
