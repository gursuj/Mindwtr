import { Task } from '@focus-gtd/core';

// Order: todo -> next -> in-progress -> done
const STATUS_ORDER: Record<string, number> = {
    'inbox': -1, // Inbox usually top? Or separate.
    'todo': 0,
    'next': 1,
    'waiting': 1,
    'someday': 1,
    'in-progress': 2,
    'done': 3,
    'archived': 4
};

export function sortTasks(tasks: Task[]): Task[] {
    return [...tasks].sort((a, b) => {
        // 1. Sort by Status
        const statusA = STATUS_ORDER[a.status] ?? 99;
        const statusB = STATUS_ORDER[b.status] ?? 99;

        if (statusA !== statusB) {
            return statusA - statusB;
        }

        // 2. Sort by Due Date (with due dates first)
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        if (a.dueDate && b.dueDate) {
            const timeA = new Date(a.dueDate).getTime();
            const timeB = new Date(b.dueDate).getTime();
            if (timeA !== timeB) return timeA - timeB;
        }

        // 3. Created At (oldest first for FIFO)
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
}
