import { Space, Input, Card } from 'antd';
import { useAtomValue } from 'jotai';
import { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { calendarDailyTasksListState } from '../store/atoms';
import { Task } from '../types/types';
import { Modal } from 'antd';

const useStyles = createUseStyles({
    search: {
        'align-items': 'center',
        'place-self': 'center',
        'display': 'flex',
        'margin-top': '20px',
    }
});

export const SearchTasks = () => {
    const classes = useStyles();
    const cardsDailyTasks = useAtomValue(calendarDailyTasksListState);
    const [searchTasks, setSearchTasks] = useState<string>('');
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

    function onSearch(): void{
        const searchResults = cardsDailyTasks.filter((task) => task?.task.includes(searchTasks));
        setFilteredTasks(searchResults);
        if(searchTasks) {
            setIsResultsModalOpen(true);
        }
    }

    return(
            <>
            <Space size="large" className={classes.search}>
                <Input.Search
                    placeholder="Search task..."
                    allowClear
                    style={{ width: 500 }}
                    onChange={(e) => setSearchTasks(e.target.value)}
                    onSearch={onSearch}
                    onClear={() => {setIsResultsModalOpen(false)}}
                    />
            </Space>
                <Modal 
                    title={filteredTasks.length ? 'Search Results' : 'No tasks found'}
                    open={isResultsModalOpen} 
                    footer={null}
                    closable={true}
                    onCancel={() => {setIsResultsModalOpen(false)}}
                >
                    {filteredTasks && filteredTasks.map((el, index) => {
                        return(
                        <Card
                            id={el?.id}
                            key={index}
                            hoverable
                            >
                            {el?.task}
                        </Card>
                    )})}
                </Modal>
            </>
            )
        }