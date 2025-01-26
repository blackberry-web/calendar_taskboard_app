import { getDaysInMonth, startOfWeek, startOfMonth, endOfMonth, addDays, getDay } from 'date-fns';
import { DisplayDays } from '../types/types';

export const gridSize = 35;

export const displayMonthGrid = (date: Date): DisplayDays[] => {
    let daysToDisplay = [{prevMonth: [], currentMonth: [], nextMonth: []}];
    const startSelectedMonth: Date = startOfMonth(date);
    const startSelectedWeek: Date  = startOfWeek(startSelectedMonth);
    const endSelectedMonth: Date = endOfMonth(date);
    const daysCurrentMonth: number = getDaysInMonth(date);
    for(let j = 0; j < (7 - (7 - getDay(startSelectedMonth))); j++){
        daysToDisplay[0].prevMonth.push(addDays(startSelectedWeek, j));
    }
    for(let i = 0; i < daysCurrentMonth; i++){
        daysToDisplay[0].currentMonth.push(addDays(startSelectedMonth, i));
    }
    if((daysToDisplay[0].prevMonth.length + daysToDisplay[0].currentMonth.length) < gridSize){
        for(let k = 1; k < (7 - getDay(endSelectedMonth)); k++){
            daysToDisplay[0].nextMonth.push(addDays(endSelectedMonth, k));
        }
    }
    return daysToDisplay;
}