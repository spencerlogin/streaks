import { useState, useEffect, useMemo } from "react";
// import '../styles/Streak.css'

function Streak({
  name,
  dates,
  formatDate,
  id,
  setUpdate,
  selectedIDs,
  setSelectedIDs,
}) {
  const today = new Date();
  const todayStr = formatDate(today);

  const [hidden, setHidden] = useState(dates.includes(todayStr));
  const [editable, setEditable] = useState(false);
  const [streakName, setStreakName] = useState(name);

  useEffect(() => {
    setHidden(dates.includes(todayStr));
  }, [dates, todayStr]);

  useEffect(() => {
    setStreakName(name);
  }, [name]);

  const currentStreak = useMemo(() => {
    const dateSet = new Set(dates);
    let count = 0;
    const d = new Date();
    d.setDate(d.getDate() - 1);
    // iterate backwards from yesterday while formatted date exists in set
    while (dateSet.has(formatDate(d))) {
      count += 1;
      d.setDate(d.getDate() - 1);
    }
    // count today last so that the streak doesn't reset if today isn't done yet, but it does increase if it was done
    if (dateSet.has(formatDate(new Date()))) {
      count += 1;
    }
    return count;
  }, [dates]);

  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-2">
        <input
          type="checkbox"
          onChange={() => {
            const newSet = new Set(selectedIDs);
            if (!newSet.delete(id)) newSet.add(id);
            setSelectedIDs(newSet);
          }}
        />
        {editable ? (
          <>
            <input
              value={streakName}
              onChange={(e) => setStreakName(e.target.value)}
            />
            <p>
              : {currentStreak} day{currentStreak == 1 ? "" : "s"}
            </p>
          </>
        ) : (
          <p>
            {streakName}: {currentStreak} day{currentStreak == 1 ? "" : "s"}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        {!hidden && (
          <button
            onClick={() =>
              fetch("/api/markStreakDone", {
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ id: id }),
              }).then((res) => {
                if (res.ok) {
                  setUpdate();
                }
                setHidden(true);
              })
            }
            className={" border rounded-sm pl-1 pr-1"}
          >
            ✓
          </button>
        )}
        <button
          onClick={() =>
            fetch("/api/deleteStreak", {
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              method: "POST",
              body: JSON.stringify({ id: id }),
            }).then((res) => {
              if (!res.ok) {
                alert(res.json()["message"]);
              } else {
                setUpdate();
              }
            })
          }
          className={" border rounded-sm pl-1 pr-1"}
        >
          ✗
        </button>
        {editable ? (
          <button
            onClick={() => {
              fetch("/api/renameStreak", {
                credentials: "include",
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id, newName: streakName }),
              }).then((res) => {
                res.json().then((data) => {
                  if (!res.ok) {
                    alert(data["message"] ?? "Failed to rename streak");
                  } else {
                    setEditable(false);
                    setUpdate();
                  }
                }).catch(() => {
                  if (!res.ok) {
                    alert("Failed to rename streak");
                  } else {
                    setEditable(false);
                    setUpdate();
                  }
                });
              });
            }}
            className=" border rounded-sm pl-1 pr-1"
          >
            save
          </button>
        ) : (
          <button
            onClick={() => {
              setStreakName(name);
              setEditable(true);
            }}
            className=" border rounded-sm pl-1 pr-1"
          >
            edit
          </button>
        )}
      </div>
    </div>
  );
}

export default Streak;
