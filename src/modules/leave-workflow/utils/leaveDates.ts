export function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getMinimumStartDate(noticeDays: number) {
  return formatDate(addDays(new Date(), noticeDays));
}