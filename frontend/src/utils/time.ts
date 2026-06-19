const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function toMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function formatTime(time: string | null): string {
  if (!time || !isValidTime(time)) {
    return "—";
  }
  const totalMinutes = toMinutes(time);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const suffix = hours < 12 ? "AM" : "PM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function isValidTime(time: string): boolean {
  return TIME_PATTERN.test(time);
}

export function isValidTimeRange(startTime: string, endTime: string): boolean {
  return isValidTime(startTime)
    && isValidTime(endTime)
    && toMinutes(endTime) > toMinutes(startTime);
}
