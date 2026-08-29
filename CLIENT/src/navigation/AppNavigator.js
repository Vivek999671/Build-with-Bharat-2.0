import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/theme';

// Import Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import InspectionsScreen from '../screens/InspectionsScreen';
import AlertsScreen from '../screens/AlertsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProjectDetailsScreen from '../screens/ProjectDetailsScreen';
import InspectionDetailsScreen from '../screens/InspectionDetailsScreen';
import RandomAssignmentScreen from '../screens/RandomAssignmentScreen';
import ConductInspectionScreen from '../screens/ConductInspectionScreen';
import LiveMonitoringScreen from '../screens/LiveMonitoringScreen';
import CCTVScreen from '../screens/CCTVScreen';
import RiskAnalyticsScreen from '../screens/RiskAnalyticsScreen';
import ReportsScreen from '../screens/ReportsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator({ route }) {
  const userRole = route.params?.userRole || 'DoSJE Official';
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: COLORS.borderLight,
          borderTopWidth: 1,
          height: 60 + Math.max(insets.bottom, 12),
          paddingBottom: Math.max(insets.bottom, 10),
          paddingTop: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'InspectionsTab') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'ProjectsTab') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'AlertsTab') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home' }}
        initialParams={{ userRole }}
      />
      <Tab.Screen 
        name="InspectionsTab" 
        component={InspectionsScreen} 
        options={{ tabBarLabel: 'Inspections' }}
        initialParams={{ userRole }}
      />
      <Tab.Screen 
        name="ProjectsTab" 
        component={ProjectsScreen} 
        options={{ tabBarLabel: 'Projects' }}
        initialParams={{ userRole }}
      />
      <Tab.Screen 
        name="AlertsTab" 
        component={AlertsScreen} 
        options={{ 
          tabBarLabel: 'Alerts',
          tabBarBadge: 3,
          tabBarBadgeStyle: { backgroundColor: COLORS.critical, fontSize: 10 },
        }}
        initialParams={{ userRole }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profile' }}
        initialParams={{ userRole }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ProjectDetails" 
          component={ProjectDetailsScreen} 
          options={{ title: 'Project Details' }} 
        />
        <Stack.Screen 
          name="InspectionDetails" 
          component={InspectionDetailsScreen} 
          options={{ title: 'Inspection Details' }} 
        />
        <Stack.Screen 
          name="RandomAssignment" 
          component={RandomAssignmentScreen} 
          options={{ title: 'Assign Inspection' }} 
        />
        <Stack.Screen 
          name="ConductInspection" 
          component={ConductInspectionScreen} 
          options={{ title: 'Conduct Field Inspection' }} 
        />
        <Stack.Screen 
          name="LiveMonitoring" 
          component={LiveMonitoringScreen} 
          options={{ title: 'Live GIS Monitoring' }} 
        />
        <Stack.Screen 
          name="CCTV" 
          component={CCTVScreen} 
          options={{ title: 'CCTV Feeds' }} 
        />
        <Stack.Screen 
          name="RiskAnalytics" 
          component={RiskAnalyticsScreen} 
          options={{ title: 'Risk & Anomaly Analytics' }} 
        />
        <Stack.Screen 
          name="Reports" 
          component={ReportsScreen} 
          options={{ title: 'Inspection Reports' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
