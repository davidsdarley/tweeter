import { render, screen} from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { anything, instance, mock, verify} from "@typestrong/ts-mockito"

import Login from "../../../../src/components/authentication/login/Login"
import { MemoryRouter } from "react-router-dom"
import React from "react"

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter"
library.add(fab);


describe("Login Component", () => {
    it("has the sign-in button is disabled when first rendered", () => {
        const {signInButton} = renderLoginAndGetElements("/")
        expect(signInButton).toBeDisabled();
    })

    it("enables the sign-in button when both the alias and password fields have text", async () => {
        const {signInButton, aliasField, passwordField, user} = renderLoginAndGetElements("/");

        await user.type(aliasField, "hi");
        await user.type(passwordField, "there");

        expect(signInButton).toBeEnabled();

    })

    it("disables the sign-in button if either the alias or password field is cleared.", async () => {
        const {signInButton, aliasField, passwordField, user} = renderLoginAndGetElements("/");

        await user.type(aliasField, "hi");
        await user.type(passwordField, "there");

        expect(signInButton).toBeEnabled();

        await user.clear(aliasField);
        expect(signInButton).toBeDisabled();

        await user.type(aliasField, "hello");
        expect(signInButton).toBeEnabled();

        await user.clear(passwordField);
        expect(signInButton).toBeDisabled();

    })

    it("has the presenter's login method called with correct parameters when the sign-in button is pressed", async () => {
        const mockPresenter = mock<LoginPresenter>();
        const mockPresenterInstance = instance(mockPresenter);

        const {signInButton, aliasField, passwordField, user} = renderLoginAndGetElements("/", mockPresenterInstance);

        const aliasInput = "hi";
        const passwordInput = "there"

        await user.type(aliasField, aliasInput);
        await user.type(passwordField, passwordInput);
        await user.click(signInButton);

        verify(mockPresenter.doLogin(aliasInput, passwordInput)).once()
    })
})

function renderLogin(originalURL: string, presenter?: LoginPresenter){
 return render( 
    <MemoryRouter>
        {!!presenter ? (<Login originalUrl={originalURL} presenter={presenter}/>): (<Login originalUrl={originalURL}/>)}
    </MemoryRouter>
 )   
}

function renderLoginAndGetElements(originalURL: string, presenter?: LoginPresenter){
    const user = userEvent.setup()
    renderLogin(originalURL, presenter);

    const signInButton = screen.getByRole("button", {name: /Sign in/i});
    const aliasField = screen.getByLabelText("alias");
    const passwordField = screen.getByLabelText("password");

    return {signInButton, aliasField, passwordField, user};
}