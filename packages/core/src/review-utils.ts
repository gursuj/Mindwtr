import type { ReviewSnapshotItem } from './ai/types';
import type { Project, Task } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

export function getStaleItems(
    tasks: Task[],
    projects: Project[],
    staleThresholdDays = 14,
    now: Date = new Date(),
): ReviewSnapshotItem[] {
    const items: ReviewSnapshotItem[] = [];

    tasks.forEach((task) => {
        if (task.deletedAt) return;
        if (task.status !== 'next' && task.status !== 'waiting') return;
        const updated = new Date(task.updatedAt || task.createdAt);
        if (Number.isNaN(updated.getTime())) return;
        const daysStale = Math.ceil((now.getTime() - updated.getTime()) / DAY_MS);
        if (daysStale <= staleThresholdDays) return;
        items.push({
            id: task.id,
            title: task.title,
            daysStale,
            status: task.status === 'waiting' ? 'waiting' : 'next',
        });
    });

    projects.forEach((project) => {
        if (project.deletedAt) return;
        if (project.status !== 'active') return;
        const updated = new Date(project.updatedAt || project.createdAt);
        if (Number.isNaN(updated.getTime())) return;
        const daysStale = Math.ceil((now.getTime() - updated.getTime()) / DAY_MS);
        if (daysStale <= staleThresholdDays) return;
        items.push({
            id: `project:${project.id}`,
            title: project.title,
            daysStale,
            status: 'project',
        });
    });

    return items.sort((a, b) => b.daysStale - a.daysStale);
}
