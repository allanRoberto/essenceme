import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '../store/authStore';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { ClientSearchScreen } from '../screens/ClientSearchScreen';
import { ClientProfileScreen } from '../screens/ClientProfileScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ProfileInfoScreen } from '../screens/ProfileInfoScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { NewClientScreen } from '../screens/NewClientScreen';
import { NewClientAvatarSelectionScreen } from '../screens/NewClientAvatarSelectionScreen';
import { NewClientStep2Screen } from '../screens/NewClientStep2Screen';
import { NewClientStep3Screen } from '../screens/NewClientStep3Screen';
import { NewClientFinalizeScreen } from '../screens/NewClientFinalizeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { AvatarSelectionScreen } from '../screens/AvatarSelectionScreen';
import { AppStackParamList, AuthStackParamList } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f3f3f3' },
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="AvatarSelection" component={AvatarSelectionScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#f3f3f3' },
      }}
    >
      <AppStack.Screen name="Home" component={HomeScreen} />
      <AppStack.Screen name="Notifications" component={NotificationsScreen} />
      <AppStack.Screen name="ProfileInfo" component={ProfileInfoScreen} />
      <AppStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <AppStack.Screen name="Menu" component={MenuScreen} />
      <AppStack.Screen
        name="ClientSearch"
        component={ClientSearchScreen}
        options={{ presentation: 'modal', headerShown: true }}
      />
      <AppStack.Screen
        name="ClientProfile"
        component={ClientProfileScreen}
        options={{ presentation: 'card', headerShown: false }}
      />
      <AppStack.Screen name="NewClient" component={NewClientScreen} />
      <AppStack.Screen name="NewClientAvatarSelection" component={NewClientAvatarSelectionScreen} />
      <AppStack.Screen name="NewClientStep2" component={NewClientStep2Screen} />
      <AppStack.Screen name="NewClientStep3" component={NewClientStep3Screen} />
      <AppStack.Screen name="NewClientFinalize" component={NewClientFinalizeScreen} />
    </AppStack.Navigator>
  );
}

export function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');

  if (isAuthenticated) {
    return <AppNavigator />;
  }

  return <AuthNavigator />;
}
