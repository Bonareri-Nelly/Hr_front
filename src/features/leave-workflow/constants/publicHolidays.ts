export function getHolidayName(date: Date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const holiday = PUBLIC_HOLIDAYS.find(
        h => h.month === month && h.day === day
    );

    return holiday?.name ?? "Public Holiday";
}
export const PUBLIC_HOLIDAYS = [
    {
        name: "New Year's Day",
        month: 1,
        day: 1,
    },
    {
        name: "Labour Day",
        month: 5,
        day: 1,
    },
    {
        name: "Madaraka Day",
        month: 6,
        day: 1,
    },
    {
        name: "Mashujaa Day",
        month: 10,
        day: 20,
    },
    {
        name: "Jamhuri Day",
        month: 12,
        day: 12,
    },
    {
        name: "Christmas Day",
        month: 12,
        day: 25,
    },
    {
        name: "Boxing Day",
        month: 12,
        day: 26,
    },
];

