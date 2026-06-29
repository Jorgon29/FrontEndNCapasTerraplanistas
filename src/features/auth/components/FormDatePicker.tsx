// features/auth/components/FormDatePicker.tsx
import { type Dispatch, type SetStateAction } from "react";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

function FormDatePicker({ selected, setSelected, defaultDate = new Date(), label }: {
    selected: Date;
    setSelected: Dispatch<SetStateAction<Date>>;
    defaultDate: Date;
    label: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center">
            <label className="text-text">{label}</label>
            
            <input 
                type="hidden" 
                name="birthdate" 
                value={selected ? selected.toISOString().split('T')[0] : ""} 
            />

            <DayPicker
                animate
                mode="single"
                selected={selected}
                onSelect={(date) => date && setSelected(date)}
                defaultMonth={defaultDate}
                fixedWeeks
                className="flex-1"
                required
            />
        </div>
    );
}

export default FormDatePicker;