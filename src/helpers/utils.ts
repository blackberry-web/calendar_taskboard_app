import {getDaysInMonth, startOfWeek, startOfMonth, endOfMonth, endOfWeek, addDays} from 'date-fns';

export const gridSize = 35;

export const displayMonthGrid = (date: Date): Date[] => {
    let daysToDisplay = [];
    const startSelectedMonth: Date = startOfMonth(date);
    const startSelectedWeek: Date  = startOfWeek(startSelectedMonth);
    const endSelectedMonth: Date = endOfMonth(date);
    const endSelectedWeek: Date = endOfWeek(endSelectedMonth);
    const daysCurrentMonth: number = getDaysInMonth(date);
    for(let i = 0; i < 35; i++){
        daysToDisplay.push(addDays(startSelectedWeek, i));
    }
    return daysToDisplay;
}