import OAuthButton from "./OAuthButton";

const OAuth = () => {
    return(
        <div className="text-center mb-3">
          <OAuthButton service="Google" tooltip="googleTooltip" icon="google"></OAuthButton>
          <OAuthButton service="Facebook" tooltip="facebookTooltip" icon="facebook"></OAuthButton>
          <OAuthButton service="Twitter" tooltip="twitterTooltip" icon="twitter"></OAuthButton>
          <OAuthButton service="LinkedIn" tooltip="linkedInTooltip" icon="linkedin"></OAuthButton>
          <OAuthButton service="Github" tooltip="githubTooltip" icon="github"></OAuthButton>
          </div>
    )
}

export default OAuth;