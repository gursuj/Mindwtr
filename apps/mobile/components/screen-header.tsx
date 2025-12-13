import type { PropsWithChildren, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import type { ThemeColors } from '@/hooks/use-theme-colors';

type ScreenHeaderProps = PropsWithChildren<{
    title: string;
    subtitle?: string;
    tc: ThemeColors;
    right?: ReactNode;
}>;

export function ScreenHeader({ title, subtitle, tc, right, children }: ScreenHeaderProps) {
    return (
        <View style={[styles.header, { backgroundColor: tc.cardBg, borderBottomColor: tc.border }]}>
            <View style={styles.topRow}>
                <View style={styles.titleBlock}>
                    <Text style={[styles.title, { color: tc.text }]} accessibilityRole="header" numberOfLines={1}>
                        {title}
                    </Text>
                    {subtitle ? (
                        <Text style={[styles.subtitle, { color: tc.secondaryText }]} numberOfLines={1}>
                            {subtitle}
                        </Text>
                    ) : null}
                </View>
                {right ? <View style={styles.right}>{right}</View> : null}
            </View>
            {children ? <View style={styles.bottom}>{children}</View> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 12,
        borderBottomWidth: 1,
        gap: 10,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    titleBlock: {
        flex: 1,
        minWidth: 0,
        gap: 2,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '500',
    },
    right: {
        flexShrink: 0,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    bottom: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
});

