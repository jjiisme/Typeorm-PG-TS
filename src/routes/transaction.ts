import express from 'express';
import { Client } from '../entities/client';
import { Transaction, TransactionType } from '../entities/transaction';

const router = express.Router();

router.post('/client/:clientId', async (req, res): Promise<any> => {
  const { clientId } = req.params;

  const { type, amount } = req.body;

  const client = await Client.findOne({ where: { id: parseInt(clientId) } });

  if (!client) {
    return res.json({
      msg: 'client not found',
    });
  }

  const transaction = await Transaction.create({
    amount,
    type,
    client,
  });

  await transaction.save();

  if (type === TransactionType.DEPOSIT) {
    client.balance = client.balance + amount;
    client.transactions = [transaction];
  } else if (type === TransactionType.WITHDRAW) {
    client.balance = client.balance - amount;
    client.transactions = [transaction];
  }

  await client.save();

  return res.json(client);
});

export { router as TransactionRouter };
