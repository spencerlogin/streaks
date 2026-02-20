import '../styles/Calendar.css'
import { useState } from 'react'
import { DayPicker } from "react-day-picker";

function Calendar({ densitySets }) {
    const [selected, setSelected] = useState()

    function keyForDate(date) {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }

    const modifiers = {
        low: (date) => densitySets && densitySets.low && densitySets.low.has(keyForDate(date)),
        mid: (date) => densitySets && densitySets.mid && densitySets.mid.has(keyForDate(date)),
        high: (date) => densitySets && densitySets.high && densitySets.high.has(keyForDate(date)),
    }

    return (
        <DayPicker
            mode="single"
            selected={selected}
            onSelect={setSelected}
            footer={selected ? `Selected: ${selected.toLocaleDateString()}` : 'Pick a day.'}
            modifiers={modifiers}
            modifiersClassNames={{ low: 'my-booked-low', mid: 'my-booked-mid', high: 'my-booked-high' }}
        />
    )
}

export default Calendar