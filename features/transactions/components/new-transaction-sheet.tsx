import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useNewTransaction } from "../hooks/use-new-transaction"
import { insertTransactionSchema } from "@/db/schema";
import z from "zod/v4";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertTransactionSchema.omit({
    id: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {

    const { isOpen, onClose } = useNewTransaction()

    const createMutation = useCreateTransaction();

    const categoryMutation = useCreateCategory();
    const categoryQuery = useGetCategories();

    const onCreateCategory = (name: string) => categoryMutation.mutate({
        name
    })

    const categoryOptions = (categoryQuery.data || []).map((category) => ({
        label: category.name,
        value: category.id
    }))

    const accountMutation = useCreateAccount();
    const accountQuery = useGetAccounts();

    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    })

    const accountOptions = (accountQuery.data || []).map((account) => ({
        label: account.name,
        value: account.id
    }))

    const isPending = createMutation.isPending || categoryMutation.isPending || accountMutation.isPending;

    const isLoading = categoryQuery.isLoading || accountQuery.isLoading

    const onSubmit = (values: FormValues) => {
        createMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        })
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Add a new transaction
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="animate-spin size-4 text-muted-foreground" />
                    </div>

                ) : (
                    <TransactionForm
                        onSubmit={onSubmit}
                        disabled={isPending}
                        onCreateCategory={onCreateCategory}
                        onCreateAccount={onCreateAccount}
                        categoryOptions={categoryOptions}
                        accountOptions={accountOptions}
                    />
                )}
            </SheetContent>
        </Sheet>
    )
}