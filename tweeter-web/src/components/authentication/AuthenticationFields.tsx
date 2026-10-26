import { Dispatch, SetStateAction } from "react";

interface Props {
    actionOnEnter: (event: React.KeyboardEvent<HTMLElement>) => void ;
    alias: string;
    setAlias: Dispatch<SetStateAction<string>>;
    password: string;
    setPassword: Dispatch<SetStateAction<string>>;
}

const AuthenticationFields = (props: Props) => {
    
    return(
        <>
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    size={50}
                    id="aliasInput"
                    placeholder="name@example.com"
                    onKeyDown={props.actionOnEnter}
                    onChange={(event) => props.setAlias(event.target.value)}
                />
                <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className="form-floating">
                <input
                    type="password"
                    className="form-control"
                    id="passwordInput"
                    placeholder="Password"
                    onKeyDown={props.actionOnEnter}
                    onChange={(event) => props.setPassword(event.target.value)}
                />
                <label htmlFor="passwordInput">Password</label>
            </div>
        </>
    )

}

export default AuthenticationFields;