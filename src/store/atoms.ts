import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Task } from '../types/types';

export const selectedTaskDate = atom(
    '' as Date | string
)

export const editingMode = atom(
    null as Task
)

export const calendarDailyTasksListState = atomWithStorage(
    'allDaysWithTasks', [] as Task[]
)