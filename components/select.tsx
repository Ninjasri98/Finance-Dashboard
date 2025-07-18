"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type Props = {
    onChange : (value? : string) => void;
    onCreate? : (name : string) => void;
    options? : {
        value : string;
        label : string;
    }[]
    value? : string | null | undefined;
    disabled? : boolean;
    placeholder? : string;
}


export const Select = ({
    onChange,
    onCreate,
    options = [],
    value,
    disabled,
    placeholder
}: Props) => {

    const onSelect = (
        option : SingleValue<{value : string, label : string}>
    ) => {
        onChange(option?.value );

    
    };

    const formattedValue = useMemo(() => {
        return options.find((option) => option.value === value);
    }, [options, value]);

    return (
        <CreatableSelect
            placeholder={placeholder}
            className="text-sm h-10"
            styles={{
                control : (base) => ( {
                    ...base,
                    borderColor : '#e2e8f0',
                    ":hover" : {
                        borderColor : '#e2e8f0',
                    }
                })
            }}
            value={formattedValue}
            isDisabled={disabled}
            options={options}
            onChange={onSelect}
            onCreateOption={onCreate}
        />
    )

}