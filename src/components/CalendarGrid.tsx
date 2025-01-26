import { createUseStyles } from 'react-jss';
import { format, startOfMonth, endOfMonth, startOfDay, isEqual, endOfDay, eachDayOfInterval, startOfWeek, endOfWeek, formatISO } from 'date-fns';
import { Header} from './Header';
import { useState} from 'react';
import { DisplayDays, Holiday } from '../types/types';
import { displayMonthGrid } from '../utils/util';
import { TaskForm } from './TaskForm';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { TaskCard} from './TaskCard';
import { useAtomValue, useSetAtom } from 'jotai';
import { calendarDailyTasksListState, selectedTaskDate } from '../store/atoms';
import { HolidayCard } from './HolidayCard';

const useStyles = createUseStyles({
    calendarGrid: {
        'display': 'grid',
        'grid-template-columns': 'repeat(7, 180px)',
        'grid-template-rows': '30px, 130px',
        'margin-top': '20px',
        'justify-content': 'center',
        'column-gap': '5px',
        'row-gap': '5px',
    },
    headerWeekdays: {
        'text-align': 'center',
        'backgroundColor': 'rgb(230,230,230)',
        'padding': '5px',
        'font-family': 'Arial, Helvetica, sans-serif',
        'font-size': '14px',
        'color': 'rgb(69,69,69)'
    },
    cell: {
        'height': '130px',
        'cursor': 'pointer',
        'backgroundColor': 'rgb(230,230,230)',
        'color': 'rgb(69,69,69)',
        'font-family': 'Arial, Helvetica, sans-serif',
        'z-index': '0',
    },
    currentMonthCell: {
        extend: 'cell',
        'backgroundColor': 'rgb(214,214,214)',
        'fontWeight': 'bold',
    },
});

export const CalendarGrid = () => {
    const classes = useStyles();
    const defaultGrid = displayMonthGrid(new Date());
    const [grid, setGrid] = useState<DisplayDays>(defaultGrid[0]);
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [publicHolidays, setPublicHolidays] = useState<Holiday[]>([]);
    const weekdaysArr = eachDayOfInterval({start: startOfWeek(new Date(), { weekStartsOn: 1 }), end: endOfWeek(new Date(), { weekStartsOn: 1 })});
    const setSelectedTaskDay = useSetAtom(selectedTaskDate);
    const setCalendarDailyTasksList = useSetAtom(calendarDailyTasksListState);
    const cardsDailyTasks = useAtomValue(calendarDailyTasksListState);
    const dailyTasks = (calendarDay: string | Date) => cardsDailyTasks.filter((task) => task?.day === formatISO(calendarDay));
    const dailyHolidays = (calendarDay: string | Date) => publicHolidays.filter((holiday) => holiday?.date === format(calendarDay, 'yyyy-MM-dd'));
    
    function handleGridDateSelect(data: DisplayDays[]): void {
        setGrid(data[0]);
    }
    
    function onDragEnd(result: DropResult): void{
        const { source, destination } = result;
        if(!result.destination){
            return;
        }  
        const newCardsDailyTasksList = [...cardsDailyTasks];
        const [reorderedTask] = newCardsDailyTasksList.filter((el) => el!.id === result.draggableId);
        const index = newCardsDailyTasksList.findIndex((el) => el?.id === result.draggableId);
        if(source.droppableId !== destination!.droppableId){
            reorderedTask!.day = destination!.droppableId;
        }
        newCardsDailyTasksList.splice(index, 1);
        const destinationDailyTasks = newCardsDailyTasksList.filter((el) => el!.day === destination!.droppableId);
        destinationDailyTasks.splice(destination!.index, 0, reorderedTask);
        const resultArr = destinationDailyTasks.concat(newCardsDailyTasksList.filter((el) => el!.day !== destination!.droppableId));
        return setCalendarDailyTasksList(resultArr);
    }

    function renderDays(day: Date, index: number, isCurrent: boolean){
            if(isEqual(startOfDay(day), startOfDay(startOfMonth(day))) || isEqual(endOfDay(day), endOfMonth(day))) {
                return (
                    <Droppable droppableId={formatISO(day)} key={index}>
                    {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <div key={formatISO(day)} className={isCurrent ? classes.currentMonthCell : classes.cell} onClick={() => {
                            if(!snapshot.isDraggingOver) {
                                setFormVisible(!formVisible); 
                            }
                            setSelectedTaskDay(formatISO(day));
                            }}>
                            &nbsp; {format(day, 'MMM')}&nbsp;{format(day, 'd')}
                            {dailyHolidays(day).length ? dailyHolidays(day).map((el, index) => {
                                return(<HolidayCard dailyHoliday={el} key={index} index={index}/>)
                            }) : null}
                            {dailyTasks(day).length ? dailyTasks(day).map((el, index) => {
                                  return(<TaskCard dailyTask={el} key={index} index={index}/>)
                            }) : null}
                            {provided.placeholder}  
                            </div>
                        </div>)}
                    </Droppable>
                )}
                return (
                    <Droppable droppableId={formatISO(day)} key={index}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            <div key={formatISO(day)} className={isCurrent ? classes.currentMonthCell : classes.cell} onClick={() => {
                            if(!snapshot.isDraggingOver) {
                                setFormVisible(!formVisible); 
                            }
                            setSelectedTaskDay(formatISO(day));
                            }}>
                            &nbsp; {format(day, 'd')}
                            {dailyHolidays(day).length ? dailyHolidays(day).map((el, index) => {
                                return(<HolidayCard dailyHoliday={el} key={index} index={index}/>)
                            }) : null}
                            {dailyTasks(day).length ? dailyTasks(day).map((el, index) => {
                                  return(<TaskCard dailyTask={el} key={index} index={index}/>)
                            }) : null}
                            {provided.placeholder}
                            </div>
                        </div>)}  
                    </Droppable>
                )}

    return(
        <>
        <Header sendDateToDisplay={handleGridDateSelect} setPublicHolidays={setPublicHolidays}/>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className={classes.calendarGrid}>
                {weekdaysArr.map((el, i) => {
                    return (
                        <div key={i} className={classes.headerWeekdays}>{format(el, 'ccc')}</div>
                    )
                })}
                {grid?.prevMonth && grid.prevMonth.map((el, index) => {
                    return renderDays(el, index, false)})}
                {grid?.currentMonth.map((el, index) => {
                    return renderDays(el, index, true)})}
                {grid?.nextMonth && grid.nextMonth.map((el, index) => {
                    return renderDays(el, index, false)})}
                </div>
            </DragDropContext>
        <TaskForm
            formVisible={formVisible} 
            setFormVisible={setFormVisible}
          />
        </>
    )
}