import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAccount = (id? : string) =>{
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async(json) =>{
            const response = await client.api.accounts[":id"]["$patch"]({
                json,
                param : {id}
            })

            return await response.json();
        },
        onSuccess : () =>{
            toast.success("Account Updated");
            queryClient.invalidateQueries({queryKey: ["account", {id}]});
            queryClient.invalidateQueries({queryKey: ["accounts"]});
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError : () =>{
            toast.error("Failed to edit account");
        }
    })

    return mutation;
}