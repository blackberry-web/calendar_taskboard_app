import {createUseStyles} from 'react-jss';
import {useState, useRef, useEffect} from 'react';
import {getYear, getMonth, getWeekOfMonth, format} from 'date-fns';
import {DayPicker} from 'react-day-picker';
import classNames from "react-day-picker/style.module.css"
import {displayMonth} from '../helpers/utils';

const useStyles = createUseStyles({
    h1: {
        'text-align': 'center',
        'font-family': 'verdana',
        'font-size': '1em',
        'margin-top': '2em',
    },
    button: {
        'fontSize': 12,
        'text-align': 'right',
        'float': 'right',
        'padding': '0.25em 1em',
        'cursor': 'pointer',
        'display': 'flex',
        'fontWeight': 'bold',
        'margin-right': '20px',
    },
    daypicker: {
        extend: 'button',
        'fontSize': 14,
        'fontWeight': 'normal',
        'margin-right': '40px',
        'margin-top': '-50px',
    }
})

export const Header = ({ sendDateToDisplay }: any) => {
    const classes = useStyles();
    const today: Date = new Date();
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [selectedMonth, setSelectedMonth] = useState<Date>(today);
    const [showDayPicker, setShowDayPicker] = useState<boolean>(false);
    const selectedYear: number = getYear(selectedDate!) || getYear(today);
    const selectedWeek: number = getWeekOfMonth(selectedDate!) || getWeekOfMonth(today);
    const dialogRef = useRef<HTMLDialogElement>(null);

    function handleDateSelect(){
        sendDateToDisplay(displayMonth(selectedDate));
    }

    const toggleDialogRef = (): void => {
        if(showDayPicker){
            dialogRef.current?.show();
        } else {
            setShowDayPicker(false)
            dialogRef.current?.close();
        }
    }

    useEffect(() => {
        toggleDialogRef();
        const closeDialogClickOutside = (event: any) => {
            if(dialogRef.current && !dialogRef.current.contains(event.target)){
                setShowDayPicker(false);
            }
        }
        document.addEventListener('mousedown', closeDialogClickOutside);
    }, [dialogRef, showDayPicker])

    return(
        <div>
            <h1 className={classes.h1}>{format(selectedMonth ?? getMonth(today), "MMMM") + ' ' + selectedYear}</h1>
            <button className={classes.daypicker} onClick={() => setShowDayPicker(!showDayPicker)} aria-controls="dialog" aria-haspopup="dialog">🗓️ Calendar</button>
            <dialog ref={dialogRef}>
            <DayPicker
                mode="single"
                required
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                selected={selectedDate}
                onSelect={(selected) => {
                    setSelectedDate(selected); 
                    handleDateSelect()}
                }
                captionLayout="dropdown"
                defaultMonth={today}
                showOutsideDays
                classNames={classNames}
            />
            </dialog>
            <button className={classes.button}>Week</button>
            <button className={classes.button}>Month</button>
        </div>
    )
}