import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConn?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const cached = globalForMongoose.mongooseConn ?? { conn: null, promise: null };

globalForMongoose.mongooseConn = cached;

export async function connectToDatabase(uri: string) {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
