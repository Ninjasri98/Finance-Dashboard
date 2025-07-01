"use client";

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useNewAccount } from '@/features/accounts/hooks/use-new-account'
import { Plus } from 'lucide-react'
import React from 'react'

const AccountsPage = () => {

    const newAccount = useNewAccount();
    return (
        <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className='text-xl line-clamp-1'>

                    </CardTitle>
                    <Button size={"sm"} onClick={newAccount.onOpen}>
                        <Plus className='size-4 mr-2' />
                        Add New
                    </Button>
                </CardHeader>
            </Card>
        </div>
    )
}

export default AccountsPage