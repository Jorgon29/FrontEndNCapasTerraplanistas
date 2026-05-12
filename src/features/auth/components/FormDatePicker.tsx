import { type Dispatch, type SetStateAction } from "react";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";

function FormDatePicker( {selected, setSelected, defaultDate = new Date(), label}  : {
    selected: Date,
    setSelected: Dispatch<SetStateAction<Date>>,
    defaultDate: Date,
    label: string
}) {
    return (
        <div className="flex flex-col items-center justify-center">
            <label className="text-text">{label}</label>
            <DayPicker
                animate
                mode="single"
                selected={selected}
                onSelect={setSelected}
                defaultMonth={defaultDate}
                fixedWeeks
                className="flex-1"
                required
            />
        </div>
    );
}

export default FormDatePicker;