import express from 'express';
import { createQueryBuilder } from 'typeorm';
import { Client } from '../entities/client';

const router = express.Router();

router.get('/:clientId', async (req, res) => {
  const clients = await createQueryBuilder('client')
    .select('client.first_name')
    .addSelect('client.last_name')
    .addSelect('client.balance')
    .addSelect('SUM(transaction.amount)', 'total')
    .from(Client, 'client')
    .leftJoinAndSelect('client.transactions', 'transaction')
    .where('client.id = :clientId', {
      clientId: req.params.clientId,
    })
    // .where('client.balance <= :balance AND ...',{balance: 10000})
    .groupBy('client.id')
    .getOne();

  res.json(clients);
});

router.post('/', async (req, res) => {
  const { firstName, lastName, email, cardNumber, balance } = req.body;

  const client = Client.create({
    first_name: firstName,
    last_name: lastName,
    email,
    card_number: cardNumber,
    balance,
  });

  await client.save();

  res.json(client);
});

router.delete('/:clientId', async (req, res) => {
  const { clientId } = req.params;

  const response = await Client.delete(clientId);

  res.json(response);
});

export { router as ClientRouter };
