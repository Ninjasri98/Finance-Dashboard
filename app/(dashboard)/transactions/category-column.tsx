import { useOpenCategory } from "@/features/categories/hooks/use-open-category"
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

type Props = {
    id : string
    category : string | null,
    categoryId : string | null ,
}

export const CategoryColumn = ({id,category,categoryId}: Props) => {

    const {onOpen : onOpencategory} = useOpenCategory();

    const onClick = () =>{
        if(categoryId){
        onOpencategory(categoryId)
        }
    }
    return (
        <div className={cn("flex items-center cursor-pointer hover:underline",
            !category && "text-rose-500"
        )} onClick={onClick}>
            {!category && <TriangleAlert className="size-4 mr-2 shrink-0"/>}
            {category || "Uncategorized"}
        </div>
    )
}