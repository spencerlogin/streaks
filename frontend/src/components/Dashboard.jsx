import { useState, useEffect } from "react";
import Streak from "./Streak";
import Calendar from "./Calendar";
// import '../styles/Dashboard.css'

function Dashboard({ userInfo }) {
  const [streaks, setStreaks] = useState([]);
  const [filteredStreaks, setFilteredStreaks] = useState(streaks);
  const [filter, setFilter] = useState("");
  const [update, setUpdate] = useState(false);
  const [densitySets, setDensitySets] = useState({
    low: new Set(),
    mid: new Set(),
    high: new Set(),
  });
  const [dates, setDates] = useState();
  const [selectedIDs, setSelectedIDs] = useState(new Set());

  function formatDateForDisplay(d) {
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  function formatDateForDB(d) {
    let fmonth =
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
    let fdate = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
    return `${d.getFullYear()}-${fmonth}-${fdate}`;
  }

  // retrieve streaks from DB
  // calculate color for each day (dependent on fraction of total streaks completed on that day)
  useEffect(() => {
    let ignore = false;
    fetch("/api/streaks", {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) {
          const streakElements = data["streaks"].map((streak) => {
            const displayDates = streak["dates"].map((streakDate) => {
              const parsedDate = new Date(streakDate);
              parsedDate.setDate(parsedDate.getDate() + 1);
              return formatDateForDisplay(parsedDate);
            });

            return {
              name: streak["name"],
              dates: displayDates,
              id: streak["id"],
            };
          });

          setStreaks(streakElements);
        }
      });
    return () => {
      ignore = true;
    };
  }, [update]);

  useEffect(() => {
    setFilteredStreaks(
      streaks.filter((streak) => streak.name.toLowerCase().includes(filter)),
    );
  }, [streaks, filter]);

  useEffect(() => {
    const counts = {};

    filteredStreaks.forEach((streak) => {
      streak.dates.forEach((dateString) => {
        const parsedDate = new Date(dateString);
        const key = formatDateForDB(parsedDate);
        counts[key] = (counts[key] || 0) + 1;
      });
    });

    const totalStreaks = filteredStreaks.length || 1;
    const low = new Set();
    const mid = new Set();
    const high = new Set();

    Object.entries(counts).forEach(([key, cnt]) => {
      const frac = cnt / totalStreaks;
      if (frac < 1 / 2) low.add(key);
      else if (frac < 1) mid.add(key);
      else high.add(key);
    });

    setDensitySets({ low, mid, high });
  }, [filteredStreaks]);

  // create new streak with name specific in formData
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData((e) => setStreakName(e.target.value));
    await fetch("/api/createStreak", {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          alert("Error");
        }
      })
      .then(() => {
        e.target.reset();
        setUpdate(!update);
      });
  };
  // add date range to 1 or more streaks
  function handleAddDates() {
    // calculate specific dates from 'from date' and 'to date'
    let curDate = new Date(dates.from);
    let toDate = new Date(dates.to);
    let selectedDates = [formatDateForDB(curDate)];
    while (curDate.getDate() != toDate.getDate()) {
      curDate.setDate(curDate.getDate() + 1);
      selectedDates.push(formatDateForDB(curDate));
    }
    fetch("/api/markStreaksDone", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: Array.from(selectedIDs),
        dates: selectedDates,
      }),
    }).then(() => setUpdate(!update));
  }

  // remove date range from 1 or more streaks
  function handleRemoveDates() {
    let curDate = new Date(dates.from);
    let toDate = new Date(dates.to);
    let selectedDates = [formatDateForDB(curDate)];
    while (curDate.getDate() != toDate.getDate()) {
      curDate.setDate(curDate.getDate() + 1);
      selectedDates.push(formatDateForDB(curDate));
    }
    fetch("/api/markStreaksNotDone", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ids: Array.from(selectedIDs),
        dates: selectedDates,
      }),
    }).then(() => setUpdate(!update));
  }

  return (
    <main className="dark:bg-(--dark-bg) dark:text-(--dark-text)">
      <div className="flex justify-between mr-25 ml-25">
        <div className="">
          <h1 className="text-3xl">{userInfo["firstName"]}'s Streaks</h1>
          <input
            type="text"
            placeholder="Filter streaks"
            onChange={(e) => setFilter(e.target.value.toLowerCase())}
            className="border rounded-sm border-stone-400"
          />
          {/* render streaks from data kept in state */}
          <div>
            <h2 className="text-2xl mt-5">TO DO:</h2>
            {filteredStreaks.map((streak) => {
              if (!streak.dates.includes(formatDateForDisplay(new Date()))) {
                return (
                  <Streak
                    key={streak.id}
                    name={streak.name}
                    dates={streak.dates}
                    formatDate={formatDateForDisplay}
                    id={streak.id}
                    setUpdate={setUpdate}
                    selectedIDs={selectedIDs}
                    setSelectedIDs={setSelectedIDs}
                  />
                );
              }
            })}
            <h2 className="text-2xl mt-5">DONE:</h2>
            {filteredStreaks.map((streak) => {
              if (streak.dates.includes(formatDateForDisplay(new Date()))) {
                return (
                  <Streak
                    key={streak.id}
                    name={streak.name}
                    dates={streak.dates}
                    formatDate={formatDateForDisplay}
                    id={streak.id}
                    setUpdate={setUpdate}
                    selectedIDs={selectedIDs}
                    setSelectedIDs={setSelectedIDs}
                  />
                );
              }
            })}
          </div>
        </div>
        <div>
          <Calendar
            densitySets={densitySets}
            selected={dates}
            setSelected={setDates}
            formatDate={formatDateForDB}
          />
          {dates && (
            <>
              <div className="add-streaks-dates">
                <button onClick={handleAddDates}>Add Dates</button>
              </div>
              <div className="remove-streaks-dates">
                <button onClick={handleRemoveDates}>Remove Dates</button>
              </div>
            </>
          )}
          <div className="create-streak">
            <form onSubmit={handleSubmit}>
              <div className="flex gap-x-2">
                <label htmlFor="streak-name">Enter Streak Name</label>
                <input
                  className={"border rounded-sm border-stone-400"}
                  id="streak-name"
                  type="text"
                  name="streakName"
                  placeholder="Streak name"
                />
              </div>
              <button className={"border rounded-sm pl-1 pr-1"} type="submit">
                Create Streak
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
