import { createUseStyles } from 'react-jss';
import { useState, useRef, useEffect } from 'react';
import { getYear, getMonth, format, subMonths, addMonths } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import classNames from "react-day-picker/style.module.css";
import { displayMonthGrid } from '../utils/util';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { DisplayDays, Holiday } from '../types/types';
import { SearchTasks } from './SearchTasks';
import { getPublicHolidays } from '../services/publicHolidays';

const useStyles = createUseStyles({
    h1: {
        'text-align': 'center',
        'font-family': 'verdana',
        'font-size': '1em',
        'padding': '0.25em 1em',
        'position': 'relative'
    },
    header: {
        'display': 'grid',
        'grid-template-columns': 'repeat(3, 1fr)',
        'grid-template-rows': '10px, 30px',
        'justify-content': 'center',
        'align-content': 'center'
    },
    button: {
        'fontSize': 12,
        'text-align': 'center',
        'padding': '0.25em 1em',
        'cursor': 'pointer',
        'fontWeight': 'bold',
    },
    daypickerButton: {
        extend: 'button',
        'fontSize': 14,
        'fontWeight': 'normal',
        'float': 'right',
        'margin-right': '300px',
        'margin-top': '-30px'
    },
    daypicker: {
        'z-index': 2,
    },
    buttonsContainer: {
        'align-self': 'center',
        'justify-self': 'flex-end',
        'margin-right': '100px',
    },
    arrowsContainer: {
        'margin-left': '100px',
        'justify-content': 'center'
    },
    arrow: {
        'display': 'inline-block',
        'padding': '0.5em 0.5em',
        'cursor': 'pointer',
        'backgroundColor': 'rgb(230,230,230)',
        'align-items': 'center',
    },
})

export const Header = (props: { sendDateToDisplay: (arg0: DisplayDays[]) => void , setPublicHolidays: (arg0: Holiday[]) => void}) => {
    const classes = useStyles();
    const today: Date = new Date();
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [selectedMonth, setSelectedMonth] = useState<Date>(today);
    const [showDayPicker, setShowDayPicker] = useState<boolean>(false);
    const selectedYear: number = getYear(selectedDate!) || getYear(today);
    const dialogRef = useRef<HTMLDialogElement>(null);

    function handleChevronUpClick(): void{
        setSelectedDate(addMonths(selectedDate, 1));
    }

    function handleChevronDownClick(): void{
        setSelectedDate(subMonths(selectedDate, 1));
    }

    function handleDateSelect(newSelected: Date): void{
        setSelectedDate(newSelected);
    }

    function toggleDialogRef(): void{
        if(showDayPicker){
            dialogRef.current?.show();
        } else {
            setShowDayPicker(false)
            dialogRef.current?.close();
        }
    }

    useEffect(() => {
        toggleDialogRef();
        const closeDialogClickOutside = (event: { target: Node | null | EventTarget; }) => {
            if(dialogRef.current && !dialogRef.current.contains(event.target as Node | null)){
                setShowDayPicker(false);
            }
        }
        document.addEventListener('mousedown', closeDialogClickOutside);
        props.sendDateToDisplay(displayMonthGrid(selectedDate));
    }, [dialogRef, showDayPicker, selectedDate])

    useEffect(() => {
        (async () => {
        const calendarPublicHolidays = await getPublicHolidays(selectedYear, 'UA');
        props.setPublicHolidays(calendarPublicHolidays);
        })();
    }, [selectedYear])

    return(
            <>
            <div>
            <SearchTasks />
            <button className={classes.daypickerButton} onClick={() => setShowDayPicker(!showDayPicker)} aria-controls="dialog" aria-haspopup="dialog">🗓️ Calendar</button>
                <dialog ref={dialogRef} className={classes.daypicker}>
                <DayPicker
                    mode="single"
                    required
                    startMonth={new Date(1970, 1)}
                    endMonth={new Date(2099, 12)}
                    month={selectedMonth}
                    onMonthChange={setSelectedMonth}
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    captionLayout="dropdown"
                    defaultMonth={today}
                    showOutsideDays
                    classNames={classNames}
                />
                </dialog>
            </div>
                <div className={classes.header}>
                    <div className={classes.arrowsContainer}>
                        <ChevronDown className={classes.arrow} onClick={handleChevronDownClick}/>
                        <ChevronUp className={classes.arrow} onClick={handleChevronUpClick}/>
                    </div>
                    <h1 className={classes.h1}>{format(selectedDate ?? getMonth(today), "MMMM") + ' ' + selectedYear}</h1>
                    <div className={classes.buttonsContainer}>
                        <button className={classes.button}>Week</button>
                        <button className={classes.button}>Month</button>
                    </div>
                </div>
            </>  
    )
}