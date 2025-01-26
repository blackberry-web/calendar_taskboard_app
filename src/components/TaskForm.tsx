import { createUseStyles } from 'react-jss';
import { Form, Input, Modal } from "antd";
import { ValidateErrorEntity } from "rc-field-form/lib/interface";
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types/types';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { calendarDailyTasksListState, editingMode, selectedTaskDate } from '../store/atoms';

const useStyles = createUseStyles({
    taskModal: {
        'position': 'relative',
        'padding': '1.2rem 2rem',
        'height': '100vh'
    }
});

export const TaskForm = (props: { formVisible: boolean; setFormVisible: (value: boolean) => void}) => {
    const classes = useStyles();
    const [form] = Form.useForm();
    const {formVisible, setFormVisible} = props;
    const [task, setTask] = useState<Task>({id: '', day: '', task: ''});
    const setCalendarDailyTasksList = useSetAtom(calendarDailyTasksListState);
    const cardsDailyTasks = useAtomValue(calendarDailyTasksListState);
    const selectedDate = useAtomValue(selectedTaskDate);
    const [editedTask, setEditedTask] = useAtom(editingMode);

    function handleOk(): void {
        form.validateFields()
            .then(() => {
                form.resetFields();
                setFormVisible(false);
                if (task !== null) {
                    editedTask ? handleEditTask(editedTask.id) : setCalendarDailyTasksList((prevState: Task[]) =>  [...prevState, task]);
                } 
                setTask(null);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    function handleEditTask(id: string): void {
        const resultList = Array.from(cardsDailyTasks);
        const indexEditedTask = resultList.findIndex((task) => task?.id === id);
        resultList.splice(indexEditedTask, 1, task);
        setCalendarDailyTasksList(resultList);
        setEditedTask(null);
        setTask(null);
    }

    function handleCancel(): void {
        if(editedTask){
            setEditedTask(null);
        }
        setFormVisible(false);
    }

    function onFinishFailed(errorInfo: ValidateErrorEntity): void{
        console.error(errorInfo);
    }

    useEffect(() => {
        if (formVisible) {
            form.setFieldValue('task', editedTask?.task);
        }
    }, [form, formVisible, editedTask])

    return(
        <div>
            <Modal
                open={formVisible}
                title={editedTask ? 'Edit task' : 'Add task'}
                okText={editedTask ? 'Save' : 'Add task'}
                cancelText='Cancel'
                onOk={handleOk}
                onCancel={handleCancel}
                className={classes.taskModal}
            >
            <Form
                form={form}
                layout='vertical'
                autoComplete='off'
                onFinishFailed={onFinishFailed}
            >
            <Form.Item<string>
                name='task'
                rules={[{required: true, message: 'Please add a task...' }]}
                >
                <Input.TextArea
                onChange={(e) => editedTask
                    ? setTask({id: editedTask.id, day: selectedDate, task: e.target.value})
                    : setTask({id: uuidv4(), day: selectedDate, task: e.target.value})}
                />
            </Form.Item>
          </Form>
        </Modal>
    </div>
   )
}