import '../styles/Calendar.css'
import { DayPicker } from "react-day-picker"

function Calendar({ densitySets, selected, setSelected }) {

    function keyForDate(date) {
        let fmonth = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
        let fdate = date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`
        return `${date.getFullYear()}-${fmonth}-${fdate}`
    }

    const modifiers = {
        low: (date) => densitySets && densitySets.low && densitySets.low.has(keyForDate(date)),
        mid: (date) => densitySets && densitySets.mid && densitySets.mid.has(keyForDate(date)),
        high: (date) => densitySets && densitySets.high && densitySets.high.has(keyForDate(date)),
    }

    return (
        <DayPicker
            mode="range"
            modifiers={modifiers}
            modifiersClassNames={{ low: 'my-booked-low', mid: 'my-booked-mid', high: 'my-booked-high' }}
            selected={selected}
            onSelect={setSelected}
            footer={ 
                selected ? `Add days to selected streaks: \n${selected.from.toLocaleDateString()}-${selected.to.toLocaleDateString()}` : 
                "Pick a day."
            }
        />
    )
}

export default Calendar