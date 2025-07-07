
import { useForm } from "react-hook-form";
import z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { insertTransactionSchema } from "@/db/schema";
import { Select } from "@/components/select";
import { DatePicker } from "@/components/date-picker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/amount-input";
import { convertAmountToMiliUnits } from "@/lib/utils";


const formSchema = z.object({
    date: z.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(),
    notes: z.string().nullable().optional()
})

const apiSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: {
        label: string,
        value: string
    }[],
    categoryOptions: {
        label: string,
        value: string
    }[],
    onCreateCategory: (name: string) => void;
    onCreateAccount: (name: string) => void
};

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateCategory,
    onCreateAccount
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues
    })

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount);
        const amountToMiliUnits = convertAmountToMiliUnits(amount);

        onSubmit({
            ...values,
            amount: amountToMiliUnits
        })

    }

    const handleDelete = () => {
        onDelete?.()
    }

    return (
        <Form {...form} >
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4 pt-4 pl-4 pr-4">
                <FormField
                    name="date"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="accountId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Account
                            </FormLabel>
                            <FormControl>
                                <Select
                                    placeholder="Select an account"
                                    options={accountOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onCreate={onCreateAccount}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="categoryId"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Category
                            </FormLabel>
                            <FormControl>
                                <Select
                                    placeholder="Select a category"
                                    options={categoryOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onCreate={onCreateCategory}
                                    disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="payee"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Payee
                            </FormLabel>
                            <FormControl>
                                <Input 
                                {...field}
                                placeholder=" Add a Payee"
                                disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="amount"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Amount
                            </FormLabel>
                            <FormControl>
                                <AmountInput 
                                {...field}
                                placeholder="0.00"
                                disabled={disabled}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                /> 
                <FormField
                    name="notes"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Notes
                            </FormLabel>
                            <FormControl>
                                <Textarea 
                                {...field}
                                value={field.value ?? ""}
                                disabled={disabled}
                                placeholder="Optional Notes"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
               
                <Button className="w-full" disabled={disabled}>
                    {id ? "Save Changes" : "Create Transaction"}
                </Button>
                {!!id && <Button
                    type="button"
                    disabled={disabled}
                    onClick={handleDelete}
                    className="w-full"
                    variant={"outline"}
                >
                    <Trash className="size-4 mr-2" />
                    Delete Transaction
                </Button>}
            </form>
        </Form>
    )
}


