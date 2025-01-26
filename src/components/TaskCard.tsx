import { createUseStyles } from 'react-jss';
import { Trash2, PencilLine } from 'lucide-react';
import { Card } from "antd";
import { Draggable } from '@hello-pangea/dnd';
import { useAtomValue, useSetAtom } from 'jotai';
import { calendarDailyTasksListState, editingMode } from '../store/atoms';
import { Task } from '../types/types';

const useStyles = createUseStyles({
    card: {
        'text-align': 'start',
        'font-family': 'verdana',
        'font-size': '12px',
        'width': '170px',
        'height': '30px',
        'z-index': '1',
        'margin-left': '5px',
        'fontWeight': 'normal',
        'cursor': 'grab',
        'overflow': 'scroll',
        'position': 'relative',
        'display': 'block'
    },
    icon: {
        'cursor': 'pointer',
        'float': 'right',
        'margin-right': '0px',
        'margin-top': '-5px',
        'width': '14px',
        'height': '24px',
    }
});

export const TaskCard = (props: { dailyTask: Task, index: number }) => {
    const classes = useStyles();
    const { dailyTask, index } = props;
    const setCalendarDailyTasksList = useSetAtom(calendarDailyTasksListState);
    const calendarDailyTasksList = useAtomValue(calendarDailyTasksListState);
    const setEditedTask = useSetAtom(editingMode);

    function handleDeleteTask(id: string): void{
        const resultList = Array.from(calendarDailyTasksList);
        const updatedArr = resultList.filter((task) => task!.id !== id);
        setCalendarDailyTasksList(updatedArr);
    }

    return(
        <>
            <Draggable draggableId={dailyTask!.id} index={index} key={dailyTask!.id + index}>
                {(provided) => (
                <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
                <Card
                    id={dailyTask!.id}
                    key={dailyTask!.id}
                    hoverable
                    className={classes.card}
                    styles={{ body: { padding: '0px 0px 0px 5px' }}}
                    draggable={true}
                    >
                    <Trash2 className={classes.icon} onClick={(e) => {e.stopPropagation(); handleDeleteTask(dailyTask!.id)}}/>
                    <PencilLine className={classes.icon} onClick={() => setEditedTask(dailyTask)}/>
                    {dailyTask!.task}
                </Card>
                </div>
                )}
            </Draggable>
        </>
    )};