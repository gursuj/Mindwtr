import { Link, Tabs } from 'expo-router';
import { Search } from 'lucide-react-native';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '../../../contexts/theme-context';
import { useLanguage } from '../../../contexts/language-context';

export default function TabLayout() {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const androidNavInset = Platform.OS === 'android' && insets.bottom >= 20
    ? Math.max(0, insets.bottom - 12)
    : 0;
  const tabBarHeight = 58 + androidNavInset;
  const iconLift = Platform.OS === 'android' ? 6 : 0;

  const activeTint = isDark ? '#93C5FD' : '#2563EB';
  const inactiveTint = isDark ? '#6B7280' : '#9CA3AF';
  const activeItemBg = isDark ? 'rgba(59, 130, 246, 0.18)' : 'rgba(37, 99, 235, 0.12)';

  return (
    <Tabs
      initialRouteName="inbox"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: activeTint,
        tabBarInactiveTintColor: inactiveTint,
        tabBarShowLabel: false,
        headerShown: true,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
        },
        headerTintColor: isDark ? '#F9FAFB' : '#111827',
        headerTitleStyle: {
          fontSize: 17,
          fontWeight: '700',
        },
        headerRight: route.name === 'menu'
          ? undefined
          : () => (
            <Link href="/global-search" asChild>
              <TouchableOpacity style={styles.headerIconButton} accessibilityLabel={t('search.title')}>
                <Search size={22} color={isDark ? '#F9FAFB' : '#111827'} />
              </TouchableOpacity>
            </Link>
          ),
        tabBarButton: (props) => (
          <HapticTab
            {...props}
            activeBackgroundColor={activeItemBg}
            inactiveBackgroundColor="transparent"
          />
        ),
        tabBarItemStyle: {
          flex: 1,
          borderRadius: 0,
          marginHorizontal: 0,
          marginVertical: 0,
          paddingVertical: 0,
          height: tabBarHeight,
          paddingBottom: androidNavInset,
          paddingTop: iconLift,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
          borderTopColor: isDark ? '#374151' : '#E5E7EB',
          paddingTop: 0,
          paddingBottom: 0,
          height: tabBarHeight,
          paddingHorizontal: 0,
          alignItems: 'stretch',
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
        },
      })}
    >
      <Tabs.Screen
        name="inbox"
        options={{
          title: t('tab.inbox'),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 28 : 24} name="tray.fill" color={color} style={{ opacity: focused ? 1 : 0.65 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="next"
        options={{
          title: t('tab.next'),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 28 : 24} name="arrow.right.circle.fill" color={color} style={{ opacity: focused ? 1 : 0.65 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="agenda"
        options={{
          title: t('tab.agenda'),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 28 : 24} name="calendar.fill" color={color} style={{ opacity: focused ? 1 : 0.65 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: t('projects.title'),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 28 : 24} name="folder.fill" color={color} style={{ opacity: focused ? 1 : 0.65 }} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: t('tab.menu'),
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={focused ? 28 : 24} name="line.3.horizontal" color={color} style={{ opacity: focused ? 1 : 0.65 }} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerIconButton: {
    marginRight: 16,
    padding: 4,
  },
});
