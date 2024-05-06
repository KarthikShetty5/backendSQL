import { app } from "./app.js";
import Razorpay from "razorpay";
import mysql from 'mysql'
import { config } from "dotenv";
config({ path: "./config/config.env" });

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

const PORT = process.env.PORT || 5000;

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
});

async function initializeDatabase() {
  // Connect to MySQL
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

  // Check if the database already exists
  connection.query("SHOW DATABASES LIKE 'labhkari'", (err, result) => {
    if (err) {
      console.error('Error checking database existence:', err);
      return;
    }

    if (result.length === 0) {
      // Database doesn't exist, create it
      connection.query("CREATE DATABASE labhkari", (err) => {
        if (err) throw err;
        console.log('Database created');
      });
    } else {
      console.log('Database already exists');
    }
  });

  // Use the labhkari database
  connection.query("USE labhkari", (err) => {
    if (err) throw err;

    console.log('Using database: labhkari');

    // Check if the table already exists
    connection.query("SHOW TABLES LIKE 'User'", (err, result) => {
      if (err) {
        console.error('Error checking User table existence:', err);
        return;
      }

      if (result.length === 0) {
        connection.query(`
                CREATE TABLE User (
                    userId VARCHAR(255),
                    email VARCHAR(255),
                    password VARCHAR(255),
                    cpassword VARCHAR(255)
                );                
                `, (err) => {
          if (err) throw err;
          console.log('Table User created');
        });
      } else {
        console.log('Table User already exists');
      }
    });

    // Check if the Product table already exists
    connection.query("SHOW TABLES LIKE 'Product'", (err, result) => {
      if (err) {
        console.error('Error checking Product table existence:', err);
        return;
      }

      if (result.length === 0) {
        connection.query(`
          CREATE TABLE Product (
              id INT AUTO_INCREMENT PRIMARY KEY,
              title VARCHAR(255),
              description TEXT,
              image VARCHAR(255),
              price DECIMAL(10, 2),
              ratings FLOAT
          );                
      `, (err) => {
          if (err) throw err;
          console.log('Product table created');
        });
      } else {
        console.log('Product table already exists');
      }
    });

    // Check if the Cart table already exists
    connection.query("SHOW TABLES LIKE 'Cart'", (err, result) => {
      if (err) {
        console.error('Error checking Cart table existence:', err);
        return;
      }

      if (result.length === 0) {
        connection.query(`
          CREATE TABLE Cart (
              id INT,
              userId VARCHAR(255),
              count INT
          );                
      `, (err) => {
          if (err) throw err;
          console.log('Cart table created');
        });
      } else {
        console.log('Cart table already exists');
      }
    });

  });

  // Close the connection
  // connection.end();
}

initializeDatabase();

export async function query({ query, values }) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

