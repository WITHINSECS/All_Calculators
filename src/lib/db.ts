import mongoose from "mongoose";

function getMongoUri() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("Missing MONGODB_URI environment variable.");
    }

    return mongoUri;
}

const MONGODB_URI = getMongoUri();

type MongooseCache = {
    connection: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

declare global {
    var mongooseCache: MongooseCache | undefined;
}

const globalForMongoose = globalThis as typeof globalThis & {
    mongooseCache?: MongooseCache;
};

const cache = globalForMongoose.mongooseCache ?? {
    connection: null,
    promise: null,
};

globalForMongoose.mongooseCache = cache;

let errorListenerAttached = false;

export async function DBconnection() {
    if (cache.connection && mongoose.connection.readyState === 1) {
        return cache.connection;
    }

    if (cache.promise && mongoose.connection.readyState === 2) {
        return cache.promise;
    }

    cache.connection = null;

    if (!cache.promise) {
        cache.promise = mongoose
            .connect(MONGODB_URI, {
                serverSelectionTimeoutMS: 5000,
            })
            .then((instance) => {
                if (!errorListenerAttached) {
                    instance.connection.on("error", (error) => {
                        cache.connection = null;
                        console.error("MongoDB connection error:", error);
                    });
                    instance.connection.on("disconnected", () => {
                        cache.connection = null;
                    });
                    errorListenerAttached = true;
                }

                return instance;
            });
    }

    try {
        cache.connection = await cache.promise;
        return cache.connection;
    } catch (error) {
        cache.promise = null;

        const errorMessage =
            error instanceof Error ? error.message : "Unknown database error";

        console.error("MongoDB connection failed:", errorMessage);
        throw new Error(`MongoDB connection failed: ${errorMessage}`);
    }
}
