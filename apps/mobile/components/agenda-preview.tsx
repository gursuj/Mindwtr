import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { isDueForReview, safeParseDate, type Task, type TaskStatus, useTaskStore } from '@mindwtr/core';

import { useLanguage } from '../contexts/language-context';
import { useTheme } from '../contexts/theme-context';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { SwipeableTaskItem } from './swipeable-task-item';

const buildSections = (tasks: Task[]) => {
  const now = new Date();
  const overdue = tasks.filter((task) => {
    const due = safeParseDate(task.dueDate);
    return Boolean(due && due < now);
  });
  const dueToday = tasks.filter((task) => {
    const due = safeParseDate(task.dueDate);
    return Boolean(due && due.toDateString() === now.toDateString());
  });
  const upcoming = tasks.filter((task) => {
    const due = safeParseDate(task.dueDate);
    return Boolean(due && due > now);
  });
  const reviewDue = tasks.filter((task) =>
    (task.status === 'waiting' || task.status === 'someday') && isDueForReview(task.reviewAt, now)
  );

  return [
    { key: 'overdue', titleKey: 'agenda.overdue', data: overdue },
    { key: 'dueToday', titleKey: 'agenda.dueToday', data: dueToday },
    { key: 'upcoming', titleKey: 'agenda.upcoming', data: upcoming },
    { key: 'review', titleKey: 'agenda.reviewDue', data: reviewDue },
  ].filter((section) => section.data.length > 0);
};

export function AgendaPreview({ onEdit }: { onEdit: (task: Task) => void }) {
  const { tasks, updateTask, deleteTask } = useTaskStore();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const tc = useThemeColors();

  const agendaTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.deletedAt) return false;
      if (task.status === 'done') return false;
      return Boolean(task.dueDate) || Boolean(task.reviewAt);
    });
  }, [tasks]);

  const sections = useMemo(() => buildSections(agendaTasks), [agendaTasks]);

  if (sections.length === 0) {
    return (
      <View style={[styles.emptyCard, { backgroundColor: tc.cardBg, borderColor: tc.border }]}>        
        <Text style={[styles.emptyTitle, { color: tc.text }]}>{t('agenda.allClear')}</Text>
        <Text style={[styles.emptySubtitle, { color: tc.secondaryText }]}>{t('agenda.noTasks')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: tc.text }]}>{t('agenda.title')}</Text>
      {sections.map((section) => (
        <View key={section.key} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: tc.secondaryText }]}>{t(section.titleKey)}</Text>
          <View style={styles.sectionList}>
            {section.data.map((task) => (
              <SwipeableTaskItem
                key={task.id}
                task={task}
                isDark={isDark}
                tc={tc}
                onPress={() => onEdit(task)}
                onStatusChange={(status: TaskStatus) => updateTask(task.id, { status })}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  sectionList: {
    gap: 10,
    paddingHorizontal: 16,
  },
  emptyCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});
