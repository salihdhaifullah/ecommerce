import { PrismaClient } from "@prisma/client";


const getPrismaClient = () => {
    return new PrismaClient({ log: [{ emit: "event", level: "query" }] })
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    prisma = getPrismaClient();
} else {
    let globalWithPrisma = global as typeof globalThis & {
        prisma: PrismaClient;
    };
    if (!globalWithPrisma.prisma) {
        globalWithPrisma.prisma = getPrismaClient();
    }
    prisma = globalWithPrisma.prisma;
}


prisma.$on("query", async (e: any) => { console.log(`${e.query} ${e.params}`) });

export default prisma;
