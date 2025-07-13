import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";
import { convertMiliUnitsToAmount } from "@/lib/utils";

const useGetSummary = () => {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const accountId = searchParams.get("accountId") || "";
  const query = useQuery({
    
    queryKey: ["summary", { from, to, accountId }],
    queryFn: async () => {
      const res = await client.api.summary.$get({
        query: { from, to, accountId },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch summary");
      }
      const { data } = await res.json();

      return {
        ...data,
        incomeAmount: convertMiliUnitsToAmount(data.incomeAmount),
        expensesAmount: convertMiliUnitsToAmount(data.expensesAmount),
        remainingAmount: convertMiliUnitsToAmount(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertMiliUnitsToAmount(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertMiliUnitsToAmount(day.income),
          expenses: convertMiliUnitsToAmount(day.expenses),
        })),
      };
    },
  });
  return query;
};

export default useGetSummary;