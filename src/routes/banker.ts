import express from 'express';
import { Banker } from '../entities/banker';
import { Client } from '../entities/client';

const router = express.Router();

router.post('/', async (req, res) => {
  const { firstName, lastName, email, cardNumber, employeeNumber } = req.body;

  const banker = Banker.create({
    first_name: firstName,
    last_name: lastName,
    email,
    card_number: cardNumber,
    employee_number: employeeNumber,
  });

  await banker.save();

  res.json(banker);
});

router.put('/:bankerId/client/:clientId', async (req, res) => {
  const { bankerId, clientId } = req.params;

  const client = await Client.findOne({ where: { id: parseInt(clientId) } });

  const banker = await Banker.findOne({ where: { id: parseInt(bankerId) } });

  if (banker && client) {
    banker.clients = [...banker.clients, client];
    await banker.save();
    res.json({
      msg: 'banker connected to client',
    });
  } else {
    res.json({
      msg: 'banker or client not found',
    });
  }
});

export { router as BankerRouter };
