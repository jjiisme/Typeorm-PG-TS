import express from 'express';
import { createConnection } from 'typeorm';
import { Banker } from './entities/banker';
import { Client } from './entities/client';
import { Transaction } from './entities/transaction';
import { BankerRouter } from './routes/banker';
import { ClientRouter } from './routes/client';
import { TransactionRouter } from './routes/transaction';

const app = express();
const main = async () => {
  try {
    await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'typeorm',
      entities: [Client, Banker, Transaction],
      synchronize: true,
    });
    console.log('Database connected');

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/client', ClientRouter);
    app.use('/api/banker', BankerRouter);
    app.use('/api/transaction', TransactionRouter);

    app.listen(8080, () => {
      console.log('Server running on port 8080');
    });
  } catch (err) {
    console.log(err);
    throw new Error('unable to connect to database');
  }
};

main();
