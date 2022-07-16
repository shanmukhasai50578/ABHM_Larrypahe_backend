import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import routes from './routes';

const app = express();


app.use(cors());

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use((data, _req, res, _next) => {
  return res.json({ data: data, is_success: true });
});


app.use('/abha', routes.abha);

app.use('*', (req, res) =>
  res.status(StatusCodes.NOT_FOUND).json({
    error: {
      message: 'not found',
    },
    is_success: false,
  })
);


app.listen(process.env.PORT, () =>
  console.log(`listening on port ${process.env.PORT}!`),
);

