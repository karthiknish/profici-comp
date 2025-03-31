// src/lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}
if (!dbName) {
  throw new Error(
    "Please define the MONGODB_DB_NAME environment variable inside .env.local"
  );
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, {
    // useNewUrlParser: true, // Deprecated in newer versions
    // useUnifiedTopology: true, // Deprecated in newer versions
  });

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    // Gracefully handle connection error in production?
    // For now, rethrow to make it obvious during development.
    throw error;
  }
}

// Optional: Function to close connection if needed (e.g., during testing or specific scenarios)
// export async function closeDatabaseConnection() {
//   if (cachedClient) {
//     await cachedClient.close();
//     cachedClient = null;
//     cachedDb = null;
//     console.log("MongoDB connection closed.");
//   }
// }
