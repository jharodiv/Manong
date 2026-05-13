import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

export default prisma;

/* In new PRISMA 7, you needed adapter to connect to the database*/
// const adapter = new PrismaPg({ connectionString: env('DATABASE_URL') });
