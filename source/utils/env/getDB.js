export const getDB = () => {
    const DB_URL = process.env.DB_URL;
    const DB_PORT = process.env.DB_PORT;
    const DB_NAME = process.env.DB_NAME;

    return {
        DB_URL,
        DB_PORT,
        DB_NAME,
    };
};
