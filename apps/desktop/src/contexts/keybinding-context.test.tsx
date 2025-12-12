import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { LanguageProvider } from './language-context';
import { KeybindingProvider } from './keybinding-context';
import { ListView } from '../components/views/ListView';
import { useTaskStore, type Task } from '@mindwtr/core';

const tasks: Task[] = [
    {
        id: '1',
        title: 'First',
        status: 'inbox',
        tags: [],
        contexts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        title: 'Second',
        status: 'inbox',
        tags: [],
        contexts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

describe('KeybindingProvider (vim)', () => {
    it('moves selection with j/k', () => {
        useTaskStore.setState({
            tasks,
            _allTasks: tasks,
            projects: [],
            _allProjects: [],
            settings: {},
        });

        render(
            <LanguageProvider>
                <KeybindingProvider currentView="inbox" onNavigate={vi.fn()}>
                    <ListView title="Inbox" statusFilter="inbox" />
                </KeybindingProvider>
            </LanguageProvider>
        );

        const first = document.querySelector('[data-task-id="1"]');
        const second = document.querySelector('[data-task-id="2"]');

        expect(first?.className).toMatch(/ring-2/);
        expect(second?.className).not.toMatch(/ring-2/);

        fireEvent.keyDown(window, { key: 'j' });

        expect(second?.className).toMatch(/ring-2/);
    });
});
