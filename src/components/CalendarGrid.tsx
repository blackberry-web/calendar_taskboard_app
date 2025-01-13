import {createUseStyles} from 'react-jss';
import {format} from 'date-fns';
import { Header } from './Header';
import {SetStateAction, useState} from 'react';

const useStyles = createUseStyles({
    calendarGrid: {
        'display': 'grid',
        'grid-template-columns': 'repeat(7, 200px)',
        'grid-template-rows': 'repeat(5, 150px)',
        'border': '1px solid',
        'margin-top': '50px',
        'justify-content': 'center'
    },
    cell: {
        'height': '150px',
        'border': '1px solid',
        'cursor': 'pointer',
        'fontWeight': 'bold',
        'backgroundColor': 'lightgray'
    }
});

export const CalendarGrid = () => {
    const classes = useStyles();
    const [grid, setGrid] = useState([]);

    function handleGridDateSelect(data: SetStateAction<never[]>) {
        setGrid(data);
    }

    return(
        <>
        <Header sendDateToDisplay={handleGridDateSelect}/>
        <div className={classes.calendarGrid}>
        {grid.map((el, index) => {
            return (
                <div key={index} className={classes.cell}>{format(el, 'd')}</div>
        )})}
        </div>
        </>
    )
}