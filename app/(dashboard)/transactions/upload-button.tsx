/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { useCSVReader } from "react-papaparse";

type Props = {
    onUpload : (results : any) => void
};

export const UploadButton = ({onUpload} : Props) => {
    const {CSVReader} = useCSVReader();
    return (
        <CSVReader>
            {({getRootProps} : any) => (
                <Button
                size={"sm"}
                className="w-full lg:w-auto"
                {...getRootProps()}
                >
                    <UploadIcon className="size-4 mr-2" />
                    Import
                </Button>
            )}
        </CSVReader>
    )
}