export type AuthStackParamList = {
  Login: undefined;
  SignUp: { avatarUri?: string } | undefined;
  AvatarSelection: undefined;
  ForgotPassword: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Notifications: undefined;
  ProfileInfo: undefined;
  ChangePassword: undefined;
  ClientSearch: undefined;
  ClientProfile: {
    clientName: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    hasClothingMatch?: boolean;
  };
  Menu: undefined;
  NewClient: { avatarUri?: string } | undefined;
  NewClientAvatarSelection: undefined;
  NewClientStep2: undefined;
  NewClientStep3:
    | {
        selectedPriorities?: string[];
        selectedObjectives?: string[];
      }
    | undefined;
  NewClientFinalize:
    | {
        selectedPriorities?: string[];
        selectedObjectives?: string[];
        styleScores?: Array<{ label: string; value: number }>;
      }
    | undefined;
};
