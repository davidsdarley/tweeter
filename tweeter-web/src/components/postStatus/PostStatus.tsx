import "./PostStatus.css";
import { useRef, useState } from "react";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo } from "../userInfo/UserInfoHooks";
import { PostStatusPresenter, PostStatusView } from "../../presenter/PostStatusPresenter";

const PostStatus = () => {
  const {displayInfoMessage, displayErrorMessage, deleteMessage} = useMessageActions()

  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getPost = ():string =>{
    return post;
  }

  const view: PostStatusView = {
    setIsLoading: setIsLoading,
    displayInfoMessage: displayInfoMessage,
    authToken: authToken,
    currentUser: currentUser,
    getPost: getPost,
    setPost: setPost,
    displayErrorMessage: displayErrorMessage,
    deleteMessage: deleteMessage,
    isLoading: isLoading
  }

  const presenterRef = useRef<PostStatusPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new PostStatusPresenter(view);
  }

  const submitPost = async (event: React.MouseEvent) => {
    presenterRef.current!.submitPost(event)
  };

  const clearPost = (event: React.MouseEvent) => {
    presenterRef.current!.clearPost(event);
  };

  const checkButtonStatus: (post:string) => boolean = (post:string) => {
    return presenterRef.current!.checkButtonStatus(post);
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={checkButtonStatus(post)}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={checkButtonStatus(post)}
          onClick={clearPost}
        >
          Clear
        </button>
        {/* <p>{`post: ${!post.trim()}`}</p>
        <p>{`authToken: ${!authToken}`}</p>
        <p>{`currentUser: ${!currentUser!.alias}`}</p>
        <p>{`isLoading: ${isLoading}`}</p>
        <p>{`disabled: ${presenterRef.current!.checkButtonStatus(post)}`}</p>
        <p>{`function: ${presenterRef.current!.checkButtonStatus}`}</p>
        <p>{`exhaustive: ${presenterRef.current!.checkButtonExhaustive(post)}`}</p> */}



      </div>
    </form>
  );
};

export default PostStatus;
