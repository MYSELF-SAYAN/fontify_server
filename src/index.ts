// create a express index code basic using ts
import express from 'express';
import createRoute from "./routes/index"
import cors from 'cors';    
import connectDB from './config/db';
// import routes from './routes';

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(createRoute);
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});