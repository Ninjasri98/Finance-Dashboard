import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useNewCategory } from "../hooks/use-new-category"
import { CategoryForm } from "./category-form"
import { insertCategorySchema } from "@/db/schema";
import z from "zod/v4";
import { useCreateCategory } from "../api/use-create-category";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertCategorySchema.pick({
    name : true,
});

type FormValues = z.input<typeof formSchema>;

export const NewAccountSheet = () =>{

    const {isOpen,onClose} = useNewCategory()

    const mutation = useCreateCategory()

    const onSubmit = (values : FormValues) => {
        mutation.mutate(values,{
            onSuccess : () =>{
                onClose();
            }
        })
    };

    return(
        <Sheet open = {isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create a category to organize your transactions
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{
                    name: "",
                }} />
            </SheetContent>
        </Sheet>
    )
}