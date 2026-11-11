import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter"
import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../src/model.service/StatusService";


describe("PostStatusPresenter", () => {

    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter; 
    let mockService: StatusService;
    const testStatus = new Status("Hello there", new User("ObiWan", "Kenobi", "GeneralKenobi", "jedimaster.jpg"), Date.now());
    const authToken: AuthToken = new AuthToken("fakeToken", Date.now());

    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockService = mock<StatusService>();


        when(postStatusPresenterSpy.service).thenReturn(instance(mockService));

        when(mockPostStatusView.displayInfoMessage("Posting status...", 0)).thenReturn("fakeMessageID");

    })

    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.postStatus(testStatus, authToken);

        verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
    })

    it("calls postStatus on the post status service with the correct status string and auth token.", async () => {
        await postStatusPresenter.postStatus(testStatus, authToken);
        verify(mockService.postStatus(testStatus, authToken)).once();
    })

    it("When successful, it tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message", async () => {
        await postStatusPresenter.postStatus(testStatus, authToken);

        verify(mockPostStatusView.deleteMessage(anything())).once();
        verify(mockPostStatusView.setPost("")).once();
        verify(mockPostStatusView.displayInfoMessage( "Status posted!", 2000)).once();
    })

    it("When NOT successful, it tells the view to clear the info message and display an error message but DOES NOT tell it to clear the post or display a status posted message.", async () => {
        let error = new Error("we did a dumb");
        when(mockService.postStatus(anything(), anything())).thenThrow(error);

        await postStatusPresenter.postStatus(testStatus, authToken);

        verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: we did a dumb")).once();
        verify(mockPostStatusView.deleteMessage(anything())).once();

        verify(mockPostStatusView.setPost("")).never();
        verify(mockPostStatusView.displayInfoMessage( "Status posted!", 2000)).never();
    })

})