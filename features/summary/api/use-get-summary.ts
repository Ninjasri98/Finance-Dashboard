import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";
import { convertAmountToMiliUnits } from "@/lib/utils";

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
        incomeAmount: convertAmountToMiliUnits(data.incomeAmount),
        expensesAmount: convertAmountToMiliUnits(data.expensesAmount),
        remainingAmount: convertAmountToMiliUnits(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountToMiliUnits(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountToMiliUnits(day.income),
          expenses: convertAmountToMiliUnits(day.expenses),
        })),
      };
    },
  });
  return query;
};

export default useGetSummary;