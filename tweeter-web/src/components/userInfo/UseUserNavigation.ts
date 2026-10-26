import { useNavigate } from "react-router-dom";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import { useMessageActions } from "../toaster/MessageHooks";
import { useRef } from "react";
import { UserNavigationPresenter, UserNavigationView } from "../../presenter/UserNavigationPresenter";

interface NavigationActions {
    navigateToUser: (
        event: React.MouseEvent
    ) => Promise<void>
}

export const useUserNavigation = (featurePath: string): NavigationActions => {

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const navigate = useNavigate();
  const { displayErrorMessage } = useMessageActions();

  const view: UserNavigationView = {
    authToken: authToken!,
    displayedUser: displayedUser!,
    setDisplayedUser: setDisplayedUser,
    featurePath: featurePath,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
  };

  const presenterRef = useRef<UserNavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new UserNavigationPresenter(view);
  }
  const navToUser = async (event: React.MouseEvent): Promise<void> => {
      presenterRef.current!.navToUser(event);
  };
  return {
      navigateToUser: (event) => navToUser(event)
  }
}