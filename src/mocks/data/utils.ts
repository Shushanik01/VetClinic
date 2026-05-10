export const deepClone = <T>(value: T): T =>
  JSON.parse(JSON.stringify(value)) as T;

export const normalizeTime = (time: string): string => {
  const matched = time.match(/^(\d{2}:\d{2})/);
  return matched ? matched[1] : time;
};

export const addMinutes = (time: string, minutesToAdd: number): string => {
  const [hours, minutes] = normalizeTime(time).split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const nextHours = Math.floor(normalized / 60)
    .toString()
    .padStart(2, '0');
  const nextMinutes = (normalized % 60).toString().padStart(2, '0');

  return `${nextHours}:${nextMinutes}`;
};

export const toDateTime = (date: string, time: string): string =>
  `${date}T${normalizeTime(time)}:00`;

export const compareDateStrings = (a: string, b: string): number =>
  new Date(a).getTime() - new Date(b).getTime();
