
import { useForm } from "react-hook-form";
import z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { insertTransactionSchema } from "@/db/schema";


const formSchema = z.object({
    date : z.coerce.date(),
    accountId : z.string(),
    categoryId : z.string().nullable().optional(),
    payee : z.string(),
    amount : z.string(),
    notes : z.string().nullable().optional()
})

const apiSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id? : string;
    defaultValues? : FormValues;
    onSubmit : (values : ApiFormValues) => void;
    onDelete? : () => void;
    disabled? : boolean;
    accountOptions : {
        label : string,
        value : string
    }[],
    categoryOptions : {
        label : string,
        value : string
    }[],
    onCreateCategory : (name : string) => void;
    onCreateAccount : (name : string) => void
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
} : Props) =>{
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues : defaultValues
    })

    const handleSubmit = ( values : FormValues) =>{
        onSubmit(values);
    }

    const handleDelete = () =>{
        onDelete?.()
    }

    return (
        <Form {...form} >
            <form 
            onSubmit={form.handleSubmit(handleSubmit)} 
            className="space-y-4 pt-4 pl-4 pr-4">
                <FormField 
                name="name"
                control={form.control}
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input 
                            disabled={disabled}
                            placeholder="Account Name(Cash, Bank, Credit Card)"
                            {...field} />
                        </FormControl>
                    </FormItem>
                )}
                />
                <Button className="w-full" disabled={disabled}>
                    {id ? "Save Changes" : "Create Account"}
                </Button>
                {!!id &&<Button
                type="button"
                disabled={disabled}
                onClick={handleDelete}
                className="w-full"
                variant={"outline"}
                >
                    <Trash className="size-4 mr-2" />
                    Delete Account
                </Button>}
            </form>
        </Form>
    )
}


