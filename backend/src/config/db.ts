import mongoose from 'mongoose';
import { exit } from 'node:process';

const connectDb = async () => {
  const db_username = process.env.DB_USERNAME;
  const db_password = process.env.DB_PASSWORD;

  if (!db_password || !db_username) {
    console.error(
      'Missing DB_USERNAME or DB_PASSWORD in environment variables',
    );
    exit(1);
  }

  const url = `mongodb+srv://${db_username}:${db_password}@cluster0.k2w1w0h.mongodb.net/?appName=Cluster0`;

  try {
    await mongoose.connect(url);
    console.log('Connected to dataBase');    
  } catch (err) {
    console.log('DataBase Error: ', err);
    exit(1);
  }
};
export default connectDb;
