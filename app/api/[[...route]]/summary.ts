import { db } from "@/db/drizzle";
import { accounts, transactions } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { differenceInDays, parse, subDays } from "date-fns";
import { and, eq, gte, lte, sql, sum } from "drizzle-orm";
import { Hono } from "hono";
import z from "zod/v4";
import { HTTPException } from "hono/http-exception";

const app = new Hono().get(
    "/",
    clerkMiddleware(),
    zValidator(
        "query",
        z.object({
            from: z.string().optional(),
            to: z.string().optional(),
            accountId: z.string().optional(),
        })
    ),
    async (c) => {
        const auth = getAuth(c);
        if (!auth?.userId) {
            throw new HTTPException(401, {
                res: c.json({ message: "Unauthorized" }, 401),
            });
        }
        const { from, to, accountId } = c.req.valid("query");
        const defaultTo = new Date();
        const defaultFrom = subDays(defaultTo, 30);

        const startDate = from
            ? parse(from, "yyyy-MM-dd", new Date())
            : defaultFrom;
        const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;
        const periodLength = differenceInDays(endDate, startDate) + 1;
        const lastPeriodStart = subDays(startDate, periodLength);
        const lastPeriodEnd = subDays(endDate, periodLength);

        async function fetchFinancialData(
            userId: string,
            startedDate: Date,
            endDate: Date
        ) {
            return await db
                .select({
                    income:
                        sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
                            Number
                        ),
                    expenses:
                        sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(
                            Number
                        ),
                    remaining: sum(transactions.amount).mapWith(Number),
                })
                .from(transactions)
                .innerJoin(accounts, eq(transactions.accountId, accounts.id))
                .where(
                    and(
                        //   accountId ? eq(accounts.id, accountId) : undefined,
                        eq(accounts.userId, userId),
                        gte(transactions.date, startedDate),
                        lte(transactions.date, endDate)
                    )
                );
        }
    }
);