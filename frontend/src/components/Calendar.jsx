import '../styles/Calendar.css'
import { DayPicker } from "react-day-picker"

function Calendar({ densitySets, selected, setSelected, formatDate }) {

    const modifiers = {
        low: (date) => densitySets && densitySets.low && densitySets.low.has(formatDate(date)),
        mid: (date) => densitySets && densitySets.mid && densitySets.mid.has(formatDate(date)),
        high: (date) => densitySets && densitySets.high && densitySets.high.has(formatDate(date)),
    }

    return (
        <DayPicker
            mode="range"
            modifiers={modifiers}
            modifiersClassNames={{ low: 'my-booked-low', mid: 'my-booked-mid', high: 'my-booked-high' }}
            selected={selected}
            onSelect={setSelected}
        />
    )
}

export default Calendar