// AI-assisted: see AI-ATTRIBUTION.md
import { render, screen} from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"

import PostStatus from "../../../../src/components/postStatus/PostStatus"
import { MemoryRouter } from "react-router-dom"
import React from "react"

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { PostStatusPresenter } from "../../../../src/presenter/PostStatusPresenter"
import { anything, instance, mock, verify } from "@typestrong/ts-mockito"
import { Status } from "tweeter-shared"
import { StatusService } from "../../../../src/model.service/StatusService"
library.add(fab);

describe("PostStatus", () => {
    it("has the Post Status and Clear buttons both disabled when initially rendered", () => {
        const {postStatusButton, clearButton} = renderPostStatusAndGetElements();

        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("has both buttons enabled when the text field has text.", async () => {
        const {postStatusButton, clearButton, inputField, user} = renderPostStatusAndGetElements();
        await user.type(inputField, "Hello There");
        
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();
    });

    it("has both buttons  disabled when the text field is cleared", async () => {
        const {postStatusButton, clearButton, inputField, user} = renderPostStatusAndGetElements();
        await user.type(inputField, "Hello There");
        
        expect(postStatusButton).toBeEnabled();
        expect(clearButton).toBeEnabled();

        await user.clear(inputField);
        
        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });

    it("presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
        const mockPresenter = mock<PostStatusPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const {postStatusButton, inputField, user} = renderPostStatusAndGetElements(mockPresenterInstance);

        await user.type(inputField, "hello there");
        expect(postStatusButton).toBeEnabled();

        await user.click(postStatusButton);

        verify(mockPresenter.submitPost(anything(), "hello there", anything(), anything())).once()
    });

    it("sends the text the user typed to StatusService.postStatus when using the real presenter", async () => {
        const postStatusSpy = jest
            .spyOn(StatusService.prototype, "postStatus")
            .mockResolvedValue(undefined);

        const {postStatusButton, inputField, user} = renderPostStatusAndGetElements();

        await user.type(inputField, "hello there");
        await user.click(postStatusButton);

        expect(postStatusSpy).toHaveBeenCalledTimes(1);
        const sentStatus: Status = postStatusSpy.mock.calls[0][0];
        expect(sentStatus.post).toBe("hello there");

        postStatusSpy.mockRestore();
    });
})

function renderPostStatus(presenter?: PostStatusPresenter){
    return render(
        <MemoryRouter>
            <PostStatus presenter={presenter}></PostStatus>
        </MemoryRouter>
    )
}
function renderPostStatusAndGetElements(presenter?: PostStatusPresenter){
    const user = userEvent.setup()
    renderPostStatus(presenter);

    const postStatusButton = screen.getByRole("button", {name: /Post Status/i});;
    const clearButton = screen.getByRole("button", {name: /Clear/i});

    const inputField = screen.getByLabelText("post");

    
    return {postStatusButton, clearButton, inputField, user};
}