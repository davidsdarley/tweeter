import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { NavbarPresenter, NavbarView } from "../../src/presenter/NavbarPresenter"
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model.service/UserService";

describe("NavbarPresenter", () => {
    let mockNavbarView: NavbarView;
    let navbarPresenter: NavbarPresenter; 
    let mockService: UserService;

    const authToken = new AuthToken("hello there", Date.now())
    beforeEach(() => {
        mockNavbarView = mock<NavbarView>();
        const mockNavbarViewInstance = instance(mockNavbarView);

        const navbarPresenterSpy = spy(new NavbarPresenter(mockNavbarViewInstance));
        navbarPresenter = instance(navbarPresenterSpy);

        mockService = mock<UserService>();  

        when(navbarPresenterSpy.service).thenReturn(instance(mockService));
    })

    it("tells the view to display a logging out message.", async () => {
        await navbarPresenter.logOut(authToken);
        verify(mockNavbarView.displayInfoMessage("Logging Out...", 0)).once();
    });

    it("calls logout on the user service with the correct auth token", async () => {
        await navbarPresenter.logOut(authToken);        
        verify(mockService.logout(authToken)).once();
    });

    it("When the logout is successful, tells the view to clear the info message that was displayed previously, clear the user info, and navigate to the login page.", async () => {
        when(mockNavbarView.displayInfoMessage(anything(), 0)).thenReturn("fakeMessageID");

        await navbarPresenter.logOut(authToken);

        verify(mockNavbarView.deleteMessage("fakeMessageID")).once();
        verify(mockNavbarView.clearUserInfo()).once();
        verify(mockNavbarView.navigate("/login")).once();
    });

    it("When the logout is NOT successful, tells the view to display an error message, and DOES NOT tell it to clear the info message, clear the user info or navigate to the login page.", async () => {
        let error = new Error("we did a dumb");
        when(mockService.logout(anything())).thenThrow(error);
        await navbarPresenter.logOut(authToken);

        verify(mockNavbarView.displayErrorMessage("Failed to log user out because of exception: we did a dumb")).once();

        verify(mockNavbarView.deleteMessage(anything())).never();
        verify(mockNavbarView.clearUserInfo()).never();
        verify(mockNavbarView.navigate("/login")).never();


    });
})