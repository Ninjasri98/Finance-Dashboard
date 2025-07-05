"use client";

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction'
import { Loader2, Plus } from 'lucide-react'
import React from 'react'
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { Skeleton } from '@/components/ui/skeleton';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';


const TransactionsPage = () => {

    const newtransaction = useNewTransaction();
    const transactionsQuery = useGetTransactions();
    const deletetransactions = useBulkDeleteTransactions();
    const transactions = transactionsQuery.data || [];

    const isDisabled = transactionsQuery.isLoading || deletetransactions.isPending

    if(transactionsQuery.isLoading){
        return(
            <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader >
                        <Skeleton className='h-8 w-48'/>
                    </CardHeader>
                    <CardContent>
                        <div className='h-[500px]  w-full flex items-center justify-center'>
                            <Loader2 className='size-6 text-slate-300 animate-spin' />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 flex lg:flex-row items-center justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>
                        Transactions History
                    </CardTitle>
                    <Button size={"sm"} onClick={newtransaction.onOpen}>
                        <Plus className='size-4 mr-2' />
                        Add New
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={transactions} filterKey='name' onDelete={
                        (row) =>{
                            const ids = row.map((r) => r.original.id);
                            deletetransactions.mutate({ids})
                        }
                    } disabled={isDisabled} />
                </CardContent>
            </Card>
        </div>
    )
}

export default TransactionsPage