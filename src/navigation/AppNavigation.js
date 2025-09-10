import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

// Main App Screens
import HomeScreen from "../screens/main/HomeScreen";
import OrganizationsScreen from "../screens/main/OrganizationsScreen";
import EventsScreen from "../screens/main/EventsScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

// Detail Screens
import AnnouncementDetailScreen from "../screens/details/AnnouncementDetailScreen";
import OrganizationDetailScreen from "../screens/details/OrganizationDetailScreen";
import EventDetailScreen from "../screens/details/EventDetailScreen";

// Admin Screens
import CreateAnnouncementScreen from "../screens/admin/CreateAnnouncementScreen";
import CreateEventScreen from "../screens/admin/CreateEventScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Organizations":
              iconName = "groups";
              break;
            case "Events":
              iconName = "event";
              break;
            case "Profile":
              iconName = "person";
              break;
            default:
              iconName = "circle";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1B365D",
        tabBarInactiveTintColor: "#8E8E93",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          headerTitle: "Augie Central",
        }}
      />
      <Tab.Screen
        name="Organizations"
        component={OrganizationsScreen}
        options={{
          title: "Organizations",
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          title: "Events",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
        options={{
          title: "Announcement",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="OrganizationDetail"
        component={OrganizationDetailScreen}
        options={{
          title: "Organization",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          title: "Event Details",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="CreateAnnouncement"
        component={CreateAnnouncementScreen}
        options={{
          title: "Create Announcement",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{
          title: "Create Event",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
};

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
};

export default AppNavigation;
