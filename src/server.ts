import express from 'express';
import router from './routes/routes';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
});