import { PUBLIC_HOLIDAYS } from "../constants/publicHolidays";

export function isPublicHoliday(date: Date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Direct holiday
    const holiday = PUBLIC_HOLIDAYS.find(
        (holiday) =>
            holiday.month === month &&
            holiday.day === day
    );

    if (holiday) {
        return true;
    }

    // Observed holiday
    // If a holiday falls on Sunday,
    // Monday becomes the public holiday.

    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);

    if (date.getDay() === 1) {
        return PUBLIC_HOLIDAYS.some((holiday) => {
            return (
                holiday.month === previousDay.getMonth() + 1 &&
                holiday.day === previousDay.getDate()
            );
        });
    }

    return false;
}
export function calculateEndDate(
    startDate: Date,
    leaveDays: number,
    countsWeekends: boolean,
    countsPublicHolidays: boolean
) {


    const endDate = new Date(startDate);



    let countedDays = 1;

    while (countedDays < leaveDays) {
        endDate.setDate(endDate.getDate() + 1);

        const day = endDate.getDay();

        const weekend =
            day === 0 || day === 6;

        const holiday =
            isPublicHoliday(endDate);

        const shouldCount =
            (countsWeekends || !weekend) &&
            (countsPublicHolidays || !holiday);

        if (shouldCount) {
            countedDays++;
        }
    }

    return endDate;
}

