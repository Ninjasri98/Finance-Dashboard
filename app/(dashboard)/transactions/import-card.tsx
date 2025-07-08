/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "date", "payee"];

interface SelectedColumnsState {
    [key: string]: string | null;
}

type Props = {
    onCancel: () => void;
    onSubmit: (data: any) => void;
    data: string[][];
};

export const ImportCard = ({ onCancel, onSubmit, data }: Props) => {

    const headers = data[0];
    const body = data.slice(1);
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
        {}
    );

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Import Transactions
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row items-center gap-x-2 gap-y-2">
                        <Button size={"sm"} onClick={onCancel} className="w-full lg:w-auto">
                            Cancel
                        </Button>
                        <Button
                            disabled={
                                Object.keys(selectedColumns).length < requiredOptions.length
                            }
                            size={"sm"}
                            className="w-full lg:w-auto"
                            onClick={onContinue}
                        >
                            Continue ({Object.keys(selectedColumns).filter(Boolean).length}/
                            {requiredOptions.length})
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
        </div>
    )

}