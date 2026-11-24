// AI-assisted: see AI-ATTRIBUTION.md
import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { UserInfoPresenter, UserInfoView } from "../../src/presenter/UserInfoPresenter";
import { UserService } from "../../src/model.service/UserService";

describe("UserInfoPresenter", () => {
    const authToken = new AuthToken("fakeToken", Date.now());
    const loggedInUser = new User("Seed", "User", "@seeduser", "seed.png");
    const otherUser = new User("User", "8", "@user8", "user8.png");

    let mockView: UserInfoView;
    let mockService: UserService;
    let presenter: UserInfoPresenter;

    beforeEach(() => {
        mockView = mock<UserInfoView>();
        // The view as the component builds it on the first render: the displayed
        // user is still the logged-in user. The presenter keeps this view.
        when(mockView.authToken).thenReturn(authToken);
        when(mockView.currentUser).thenReturn(loggedInUser);
        when(mockView.displayedUser).thenReturn(loggedInUser);

        const presenterSpy = spy(new UserInfoPresenter(instance(mockView)));
        presenter = instance(presenterSpy);

        mockService = mock<UserService>();
        when(presenterSpy.service).thenReturn(instance(mockService));

        when(mockService.getFollowerCount(anything(), "@seeduser")).thenResolve(18);
        when(mockService.getFolloweeCount(anything(), "@seeduser")).thenResolve(18);
        when(mockService.getFollowerCount(anything(), "@user8")).thenResolve(4);
        when(mockService.getFolloweeCount(anything(), "@user8")).thenResolve(7);
    });

    it("requests the follower count for the user passed in, not the view's stale displayed user", async () => {
        await presenter.setNumbFollowers(otherUser);

        verify(mockService.getFollowerCount(authToken, "@user8")).once();
        verify(mockService.getFollowerCount(anything(), "@seeduser")).never();
        verify(mockView.setFollowerCount(4)).once();
    });

    it("requests the followee count for the user passed in, not the view's stale displayed user", async () => {
        await presenter.setNumbFollowees(otherUser);

        verify(mockService.getFolloweeCount(authToken, "@user8")).once();
        verify(mockService.getFolloweeCount(anything(), "@seeduser")).never();
        verify(mockView.setFolloweeCount(7)).once();
    });

    it("checks follower status against the user passed in", async () => {
        when(mockService.getIsFollowerStatus(anything(), anything(), anything())).thenResolve(true);

        await presenter.setIsFollowerStatus(otherUser);

        verify(mockService.getIsFollowerStatus(authToken, loggedInUser, otherUser)).once();
        verify(mockView.setIsFollower(true)).once();
    });

    it("does not ask the service for follower status when viewing the logged-in user", async () => {
        await presenter.setIsFollowerStatus(loggedInUser);

        verify(mockService.getIsFollowerStatus(anything(), anything(), anything())).never();
        verify(mockView.setIsFollower(false)).once();
    });
});
