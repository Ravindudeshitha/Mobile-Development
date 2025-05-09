import 'dotenv/config';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

import authRoutes from './Routes/authRoutes.js';
import booksRoutes from './Routes/booksRoutes.js';
import { connectDB } from './lib/db.js';

app.use("/api/auth", authRoutes); 
app.use("/api/books", booksRoutes); 

app.listen(PORT, () =>{
    console.log(`Server is running on ${PORT}`);
    connectDB();
});