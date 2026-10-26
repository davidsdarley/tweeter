import { IconName } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useMessageActions } from "../../toaster/MessageHooks";

interface Props {
    service: string,
    tooltip: string,
    icon: IconName
}

const OAuthButton = (props: Props) => {

    const { displayInfoMessage} = useMessageActions();
    const displayInfoMessageWithDarkBackground = (message: string): void => {
        displayInfoMessage(
          message,
          3000,
          "text-white bg-primary"
        );
      };
    return(
        <button
              type="button"
              className="btn btn-link btn-floating mx-1"
              onClick={() =>
                displayInfoMessageWithDarkBackground(
                    `${props.service} is not implemented.`
                )
              }
            >
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={props.tooltip}>{props.service}</Tooltip>}
              >
                <FontAwesomeIcon icon={["fab", props.icon]} />
              </OverlayTrigger>
            </button>
    );
}

export default OAuthButton