export type DisplayDays = {
    prevMonth: Date[], 
    currentMonth: Date[], 
    nextMonth: Date[]
}

export type Task = {
    id: string,
    day: Date | string | undefined,
    task: string,
} | null;

export type Holiday = {
    date: Date | string,
    name: string,
};