import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { isPublicHoliday, } from "../utils/dateCalculator";
import { getHolidayName, } from "../constants/publicHolidays";

function isDateInRange(
    date: Date,
    startDate: string,
    endDate: string
) {
    if (!startDate || !endDate) return false;

    const current = new Date(date);
    current.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    return current >= start && current <= end;
}

function LegendItem({
    color,
    label,
}: {
    color: string;
    label: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
                fontSize: ".82rem",
            }}
        >
            <span
                style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "999px",
                    background: color,
                    display: "inline-block",
                    border: "1px solid rgba(0,0,0,.08)",
                    flexShrink: 0,
                }}
            />

            <span>{label}</span>
        </div>
    );
}

type LeaveCalendarProps = {
    selectedLeave: {
        startDate: string;
        endDate: string;
        leaveType: string;
        status: string;
    };
};

export default function LeaveCalendar({
    selectedLeave,
}: LeaveCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const monthName = currentMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    function previousMonth() {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
            )
        );
    }

    function nextMonth() {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
            )
        );
    }

    return (
        <div className="panel">

            <div className="panel-header"
                style={{
                    display: "block",
                }}>
                <h3
                    style={{
                        textAlign: "center",
                    }}
                >📅 Leave Planning Calendar</h3>

                <p
                    style={{
                        marginTop: "6px",
                        marginBottom: "18px",
                        color: "var(--text-secondary)",
                        textAlign: "center",
                    }}
                >
                    Plan your leave before submitting an application.
                </p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "12px",
                        marginTop: "12px",
                    }}
                >
                    <button
                        className="button button-secondary"
                        onClick={previousMonth}
                    >
                        ◀
                    </button>

                    <strong
                        style={{
                            minWidth: "170px",
                            textAlign: "center",
                            fontSize: "1rem",
                        }}
                    >
                        {monthName}
                    </strong>

                    <button
                        className="button button-secondary"
                        onClick={nextMonth}
                    >
                        ▶
                    </button>
                </div>
            </div>
            <div className="panel-body">

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "3fr 1fr",
                        gap: "24px",
                        alignItems: "start",
                    }}
                >
                    {/* Calendar */}

                    <div>

                        <Calendar
                            activeStartDate={currentMonth}
                            value={new Date()}
                            onChange={() => { }}
                            onActiveStartDateChange={({ activeStartDate }) => {
                                if (activeStartDate) {
                                    setCurrentMonth(activeStartDate);
                                }
                            }}
                            prevLabel={null}
                            nextLabel={null}
                            prev2Label={null}
                            next2Label={null}
                            tileContent={({ date }) => {

                                const isPlannedLeave = isDateInRange(
                                    date,
                                    selectedLeave.startDate,
                                    selectedLeave.endDate
                                );
                                const holiday = isPublicHoliday(date);
                                const weekend = date.getDay() === 0 || date.getDay() === 6;

                                let dotColor = "";
                                let tooltip = "";

                                if (isPlannedLeave) {
                                    const isLastDay =
                                        selectedLeave.endDate ===
                                        date.toISOString().split("T")[0];

                                    return (
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                marginTop: "2px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    width: "8px",
                                                    height: "8px",
                                                    borderRadius: isLastDay ? "2px" : "50%",
                                                    background: "#3b82f6",
                                                }}
                                            />
                                        </div>
                                    );
                                }

                                if (holiday) {
                                    dotColor = "#facc15";
                                    tooltip = getHolidayName(date);
                                } else if (weekend) {
                                    dotColor = "#ef4444";
                                    tooltip =
                                        "Weekend\nNot counted for Annual, Sick or Compassionate Leave";
                                }

                                if (!dotColor) return null;

                                return (
                                    <div
                                        title={tooltip}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "100%",
                                            marginTop: "2px",
                                            pointerEvents: "auto",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <span
                                            style={{
                                                width: "7px",
                                                height: "7px",
                                                borderRadius: "50%",
                                                backgroundColor: dotColor,
                                            }}
                                        />
                                    </div>
                                );
                            }}
                            tileClassName={({ date }) => {
                                const classes = ["calendar-tile"];

                                if (isPublicHoliday(date)) {
                                    classes.push("calendar-holiday");
                                }

                                if (date.getDay() === 0 || date.getDay() === 6) {
                                    classes.push("calendar-weekend");
                                }

                                return classes.join(" ");
                            }}
                        />
                    </div>

                    {/* Guide */}

                    <div
                        className="panel"
                        style={{
                            height: "360px",
                            padding: "12px 6px",
                            width: "282px",


                        }}
                    >
                        <div className="panel-header">
                            <strong>Calendar Guide</strong>
                        </div>

                        <div className="panel-body">
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "12px",
                                    fontSize: ".85rem",
                                }}
                            >
                                <LegendItem
                                    color="#22c55e"
                                    label="Working Day"
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "12px",
                                    fontSize: ".85rem",
                                }}
                            >
                                <LegendItem
                                    color="#ef4444"
                                    label="Weekend"
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "12px",
                                    fontSize: ".85rem",
                                }}
                            >
                                <LegendItem
                                    color="#facc15"
                                    label="Public Holiday"
                                />
                            </div>

                            <hr />

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "12px",
                                    fontSize: ".85rem",
                                }}
                            >
                                <LegendItem
                                    color="#3b82f6"
                                    label="Planned Leave"
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "12px",
                                    fontSize: ".85rem",
                                }}
                            >
                                <LegendItem
                                    color="#8b5cf6"
                                    label="Approved Leave"
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "12px",
                                    fontSize: ".85rem",
                                }}
                            >
                                <LegendItem
                                    color="#f97316"
                                    label="Pending Approval"
                                />
                            </div>


                            <hr />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "12px",
                                    fontSize: ".85rem",
                                }}
                            >
                                <LegendItem
                                    color="#d1d5db"
                                    label="Today"
                                />
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}