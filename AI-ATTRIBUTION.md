## 2026-11-16: N/A
    - Tool: Claud and myself
    - Task: Help me through the process of manually building the first lambda
    - Review: answered various questions and helped me diagnose errors so I could properly understand one path from beginning to end.
## 2026-11-16: N/A
    - Tool: Claud and myself
    - Task: Review my first task prompt
    - Review: drastically improved specificity, helped me understand how specific I should be and realize I had not in fact told it to read some files it really should have
## 2026-11-16: tweeter-server/src/lambda/follow/GetFollowersLambda.ts (new file), tweeter-server/test/lambda/GetFollowersLambda.test.ts (new file), tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/FollowService.ts, AI-ATTRIBUTION.md (new file)
- Tool: Claude Code (Claude Opus 5.5)
- Task: Add the getFollowers feature end to end (Lambda, template.yaml path and function blocks, ServerFacade.getMoreFollowers, client FollowService calling the server), mirroring getFollowees, with Lambda tests.
- Review: template.yaml changes look good. ServerFacade changes are good, just replacing their own fakedata calls. Changes appear to be within scope and complete the task. All tests passed. Site builds, opens, and appears to behave the same. Changes accepted.
## 2026-11-16: tweeter-web/test/network/ServerFacade.test.ts (new file)
- Tool: Claude (claude.ai chat)
- Task: Wrote integration tests for ServerFacade's getMoreFollowers and getMoreFollowees, checking results against FakeData, paging with lastItem, and page size.
- Review: Tests appear to be testing what they say they do. I am able to break the tests be changing expected values so they are testing real things. Manual testing agrees they are working. Changes accepted.
## 2026-11-16: tweeter-shared/src/model/dto/StatusDto.ts (new file), tweeter-shared/src/model/net/request/PagedStatusItemRequest.ts (new file), tweeter-shared/src/model/net/response/PagedStatusItemResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/StatusService.ts (new file), tweeter-server/src/lambda/status/GetFeedLambda.ts (new file), tweeter-server/test/lambda/GetFeedLambda.test.ts (new file), tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/StatusService.ts, tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Add the getFeed feature end to end (shared StatusDto and PagedStatusItem request/response, server StatusService, GetFeedLambda, template.yaml /feed/get blocks, ServerFacade.getMoreFeedItems, client StatusService calling the server), mirroring getFollowees, with Lambda and ServerFacade tests.
- Review: tests all pass. Followed code flow through and it works the same and makes sense. Tested it with the site and all works after deployment. Changes accepeted.
## 2026-11-16: tweeter-shared/src/model/domain/Status.ts, tweeter-server/src/model/service/StatusService.ts, tweeter-server/test/lambda/GetFeedLambda.test.ts, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/StatusService.ts, tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Add Status.toDto and Status.fromDto (like User's) and replace the hand-written Status/StatusDto conversions in the getFeed code and tests with them.
- Review: Tests are virtually the same as the previous ones and appear to test the appropriate things. Changes accepted.
## 2026-11-16: tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/lambda/status/GetStoryLambda.ts (new file), tweeter-server/test/lambda/GetStoryLambda.test.ts (new file), tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/StatusService.ts, tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Add the getStory feature end to end (server StatusService.loadMoreStoryItems, GetStoryLambda, template.yaml /story/get blocks, ServerFacade.getMoreStoryItems, client StatusService calling the server), mirroring getFeed, with Lambda and ServerFacade tests.
- Review: follows same route as feed. Code logic is good. Tests do what they say and break when given bad info. Site works the same when tested. All integration and unit tests passed. Changes accepted.
## 2026-11-16: tweeter-shared/src/model/net/request/IsFollowerRequest.ts (new file), tweeter-shared/src/model/net/response/GetUserResponse.ts (new file), tweeter-shared/src/model/net/response/GetCountResponse.ts (new file), tweeter-shared/src/model/net/response/IsFollowerResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/user/GetUserLambda.ts (new file), tweeter-server/src/lambda/user/GetFolloweeCountLambda.ts (new file), tweeter-server/src/lambda/user/GetFollowerCountLambda.ts (new file), tweeter-server/src/lambda/user/GetIsFollowerStatusLambda.ts (new file), tweeter-server/test/lambda/GetUserLambda.test.ts (new file), tweeter-server/test/lambda/GetFolloweeCountLambda.test.ts (new file), tweeter-server/test/lambda/GetFollowerCountLambda.test.ts (new file), tweeter-server/test/lambda/GetIsFollowerStatusLambda.test.ts (new file), tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts, tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Move getUser, getFolloweeCount, getFollowerCount, and getIsFollowerStatus from the client UserService to a server UserService end to end (shared request/response types, Lambdas, template.yaml blocks, ServerFacade methods, client UserService calling the server), mirroring the feed code, with Lambda and ServerFacade tests.
- Review: Task prompt was way too large, so learning now for next time. template.yaml file changes are all looking good. The lambda functions all appropriately call userservice and return appropriate responses in the right shapes for the dtos. New UserService in the server has appropriate methods, each of which call the correct methods from fakedata. index.ts follows the correct export convetions. original UserService in tweeter-web is only modified on the functions I requested for it to be modified on, and all call the appropriate ServerFacade methods. Functionality appears the same when I open the site, numbers appropriately randomly generated. Tests all appear to do what they say they do, and break when I give them bad info. No files altered that should not have been. Despite the fact I will not any time soon be making such a large task request, changes will be accepted.
## 2026-11-16: tweeter-shared/src/model/net/response/FollowResponse.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/lambda/follow/FollowLambda.ts (new file), tweeter-server/src/lambda/follow/UnfollowLambda.ts (new file), tweeter-server/test/lambda/FollowLambda.test.ts (new file), tweeter-server/test/lambda/UnfollowLambda.test.ts (new file), tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/FollowService.ts, tweeter-web/src/presenter/UserInfoPresenter.ts, tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Move follow and unfollow from UserInfoPresenter to the server FollowService end to end (shared FollowResponse, Lambdas, template.yaml /user/follow and /user/unfollow blocks, ServerFacade methods, client FollowService calling the server), mirroring the feed code, with Lambda and ServerFacade tests.
- Review: all tests run. UserInfoPresenter is nicely modified with minimal change, delegating stuff that shouldn't have been there to the client follow service. client follow service appropriately calls serverFacade. ServerFacade sends the appropriate requests. Single follow response works well since follow and unfollow both need the same info. Lambdas parse only. Discovered repeated functionality, AI has made a method for getting getFollowerCount in both User and Follow services. Returning to work with the agent to fix this.
## 2026-11-16: tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/follow/GetFolloweeCountLambda.ts (new file, moved from lambda/user), tweeter-server/src/lambda/follow/GetFollowerCountLambda.ts (new file, moved from lambda/user), tweeter-server/src/lambda/follow/GetIsFollowerStatusLambda.ts (new file, moved from lambda/user), tweeter-server/src/lambda/user/GetFolloweeCountLambda.ts (deleted), tweeter-server/src/lambda/user/GetFollowerCountLambda.ts (deleted), tweeter-server/src/lambda/user/GetIsFollowerStatusLambda.ts (deleted), tweeter-server/template.yaml, tweeter-server/test/lambda/GetFolloweeCountLambda.test.ts, tweeter-server/test/lambda/GetFollowerCountLambda.test.ts, tweeter-server/test/lambda/GetIsFollowerStatusLambda.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Remove duplicated count logic by moving getFolloweeCount, getFollowerCount, and getIsFollowerStatus from the server UserService to the server FollowService (follow/unfollow now reuse them), and move their Lambdas from lambda/user to lambda/follow, updating template.yaml and test imports.
- Review: all previous review notes hold true. Follow and Unfollow functions in FollowService loot good. Tests still pass. Deploying... After deployment everything works normally. Changes accepted.
## 2026-11-16: tweeter-shared/src/model/net/request/PostStatusRequest.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/lambda/status/PostStatusLambda.ts (new file), tweeter-server/test/lambda/PostStatusLambda.test.ts (new file), tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/StatusService.ts, tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Move postStatus from the client StatusService to the server StatusService end to end (shared PostStatusRequest, PostStatusLambda, template.yaml /status/post blocks, ServerFacade.postStatus, client StatusService calling the server), mirroring the feed code, with Lambda and ServerFacade tests.
- Review: server facade follows the same general format as all the previous methods. Lambda looks good. server StatusService just resolves the promise immediately but that's what we want right now. New request appropriately uses the status dto. Server tests pass. Behavior the same after deploying. Changes accepted.
## 2026-11-16: tweeter-shared/src/model/net/request/LogoutRequest.ts (new file), tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/user/LogoutLambda.ts (new file), tweeter-server/test/lambda/LogoutLambda.test.ts (new file), tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts, tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Move logout from the client UserService to the server UserService end to end (shared LogoutRequest, LogoutLambda, template.yaml /user/logout blocks, ServerFacade.logout, client UserService calling the server), mirroring the feed code, with Lambda and ServerFacade tests.
- Review: immediately saw an issue with the new LogoutRequest it made and went back to agent.
## 2026-11-16: tweeter-shared/src/model/net/request/LogoutRequest.ts (deleted), tweeter-shared/src/index.ts, tweeter-server/src/lambda/user/LogoutLambda.ts, tweeter-server/test/lambda/LogoutLambda.test.ts, tweeter-web/src/network/ServerFacade.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Since LogoutRequest added nothing to TweeterRequest, remove it and refactor all code that used it to use TweeterRequest directly.
- Review: ServerFacade sends its request with nothing but a normal tweeter request and response, good for minimal operation. All changes are pretty much just moving things to other files, and all look good. Behavior is all the same after deployment. Changes accepted.
## 2026-11-16: tweeter-shared/src/model/dto/AuthTokenDto.ts (new file), tweeter-shared/src/model/net/request/LoginRequest.ts (new file), tweeter-shared/src/model/net/request/RegisterRequest.ts (new file), tweeter-shared/src/model/net/response/AuthResponse.ts (new file), tweeter-shared/src/model/domain/AuthToken.ts, tweeter-shared/src/index.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/user/LoginLambda.ts (new file), tweeter-server/src/lambda/user/RegisterLambda.ts (new file), tweeter-server/test/lambda/LoginLambda.test.ts (new file), tweeter-server/test/lambda/RegisterLambda.test.ts (new file), tweeter-server/template.yaml, tweeter-web/src/network/ServerFacade.ts, tweeter-web/src/model.service/UserService.ts, tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Move login and register from the client UserService to the server UserService end to end (shared LoginRequest, RegisterRequest, AuthResponse, AuthTokenDto, Lambdas, template.yaml /user/login and /user/register blocks replacing the /user/create placeholder, ServerFacade methods, client UserService calling the server), mirroring the feed code, with Lambda and ServerFacade tests.
- Review: Looks pretty good. It is 10:30PM and I've been working on this same blasted project since 11AM, so I know this isn't nearly good enough of a review but it's following all the same pattern as before, it works, and I'm 90% sure I know what it's doing. Changes accepted.
## 2026-11-17: tweeter-server/template.yaml, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Add a `description:` under `post:` for every endpoint in the tweeterApi `paths:` section of template.yaml, saying what the endpoint does, what the request contains, and what the response returns.
- Review: ONly additions, no removals to anything. Each addition is fairly short. After reading through the descriptions, that is indeed what they do and the correct info about their requests and responses. Changes Accepted. 
## 2026-11-17: tweeter-server/src/lambda/handleErrors.ts (new file), tweeter-server/src/model/service/RequestValidation.ts (new file), tweeter-server/src/lambda/follow/FollowLambda.ts, tweeter-server/src/lambda/follow/UnfollowLambda.ts, tweeter-server/src/lambda/follow/GetFolloweesLambda.ts, tweeter-server/src/lambda/follow/GetFollowersLambda.ts, tweeter-server/src/lambda/follow/GetFolloweeCountLambda.ts, tweeter-server/src/lambda/follow/GetFollowerCountLambda.ts, tweeter-server/src/lambda/follow/GetIsFollowerStatusLambda.ts, tweeter-server/src/lambda/status/GetFeedLambda.ts, tweeter-server/src/lambda/status/GetStoryLambda.ts, tweeter-server/src/lambda/status/PostStatusLambda.ts, tweeter-server/src/lambda/user/GetUserLambda.ts, tweeter-server/src/lambda/user/LoginLambda.ts, tweeter-server/src/lambda/user/LogoutLambda.ts, tweeter-server/src/lambda/user/RegisterLambda.ts, tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/test/lambda/handleErrors.test.ts (new file), tweeter-server/test/lambda/FollowLambda.test.ts, tweeter-server/test/lambda/UnfollowLambda.test.ts, tweeter-server/test/lambda/GetFolloweesLambda.test.ts, tweeter-server/test/lambda/GetFollowersLambda.test.ts, tweeter-server/test/lambda/GetFolloweeCountLambda.test.ts, tweeter-server/test/lambda/GetFollowerCountLambda.test.ts, tweeter-server/test/lambda/GetIsFollowerStatusLambda.test.ts, tweeter-server/test/lambda/GetFeedLambda.test.ts, tweeter-server/test/lambda/GetStoryLambda.test.ts, tweeter-server/test/lambda/PostStatusLambda.test.ts, tweeter-server/test/lambda/GetUserLambda.test.ts, tweeter-server/test/lambda/LoginLambda.test.ts, tweeter-server/test/lambda/LogoutLambda.test.ts, tweeter-server/test/lambda/RegisterLambda.test.ts, tweeter-web/src/network/ClientCommunicator.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Add consistent error handling to all Lambdas (handleErrors wrapper that prefixes unprefixed errors with [internal-server-error], [bad-request] validation in server services for missing token / empty alias / pageSize <= 0, ClientCommunicator reading error.error ?? error.errorMessage) so API Gateway returns 400/500 instead of 200, with tests.
- Review: Made an unauthorized change to the ClientCommunicator, change reversed. handleErrors makes minimal changes and appropriately wraps parsing functions. Tests pass. Behavior normal. Changes accepted. 
## 2026-11-18: tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Add the missing imports for describe, it, and expect to tweeter-web/test/network/ServerFacade.test.ts.
- Review: This one was more of a test to see if the AI could find the correct things to import. It did. Changes accepted.
## 2026-11-19: PostStatus sequence diagram (new file, submitted as PDF)
- Tool: Claude (claude.ai chat)
- Task: Drafted a Mermaid UML sequence diagram of a successful status post, from PostStatus.submitPost() through API Gateway and the PostStatusLambda to the final displayInfoMessage(), based on my PostStatus component, PostStatusPresenter, and PostStatusLambda code.
- Review: A few misunderstanding about how doToastOperation works and excessively flowery language and descriptions. Corrected doTOastOperation and rewrote bits that I didn't like, then diagram accepted.
## 2026-11-23: tweeter-server/build-layer.sh, tweeter-web/src/network/ClientCommunicator.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Fix build-layer.sh so the bcryptjs install no longer deletes tweeter-shared from the Lambda layer, and fix ClientCommunicator so failed requests show the server's error message instead of a blank one.
- Review: Was trying to fix an issue where register doesn't work. After testing this, that issue was not actually fixed. This did fix real issues I didn't know about though, so changes accepted. 

## 2026-11-23: tweeter-web/src/presenter/RegisterPresenter.ts, tweeter-web/src/components/authentication/register/Register.tsx, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Fix Register sending empty fields ("[bad-request] Missing user alias") by passing the current form values into RegisterPresenter.doRegister as parameters, the way Login passes them to doLogin, instead of reading them from the view captured on the first render.
- Review: The issue is fixed, now works the same way Login does. Simple change, changes accepted.

## 2026-11-23: tweeter-server/src/dao/UserDAO.ts (new file), tweeter-server/src/dao/FollowDAO.ts (new file), tweeter-server/src/dao/StatusDAO.ts (new file), tweeter-server/src/dao/AuthTokenDAO.ts (new file), tweeter-server/src/dao/ImageDAO.ts (new file), tweeter-server/src/dao/DAOFactory.ts (new file), tweeter-server/src/dao/dynamo/DynamoDAOFactory.ts (new file), AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Create the database-agnostic DAO interfaces (User, Follow, Status, AuthToken, Image) and the DAOFactory interface for tweeter-server, plus a DynamoDAOFactory whose getters throw "not implemented"; no implementations and no service changes.
- Review: DAOs have the info I need them to have. All stored in a good spot. nothing edited, only new things created. DAOFactory looking good. Changes accepted.

## 2026-11-23: tweeter-server/src/dao/dynamo/DynamoConfig.ts (new file), tweeter-server/src/dao/dynamo/DynamoUserDAO.ts (new file), tweeter-server/src/dao/dynamo/DynamoAuthTokenDAO.ts (new file), tweeter-server/src/dao/dynamo/DynamoDAOFactory.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Implement DynamoUserDAO and DynamoAuthTokenDAO using a single shared DynamoDBDocumentClient and a central table/region config file, and return them from DynamoDAOFactory; no interface or service changes.
- Review: New files do what I asked for them to do and no more. The only existing file altered is the DAO factory. Config file created and correctly identifies the tabels I made in Dynamo earlier. DAO factory only changed in the places for the authtoken and user, as they should. Changes accepted.

## 2026-11-23: tweeter-server/src/dao/dynamo/DynamoPaging.ts (new file), tweeter-server/src/dao/dynamo/DynamoFollowDAO.ts (new file), tweeter-server/src/dao/dynamo/DynamoDAOFactory.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Implement DynamoFollowDAO (follows table and follows_index GSI) with paging in a reusable query helper that StatusDAO can use later, and return it from DynamoDAOFactory; no interface or service changes.
- Review: Paged item logic put into newly made DynamoPaging.ts, and looks good. DynamoFollowDAO accesses both the main follow table and the reversed index part. Minimal changes to the factory, returns the dao now. All looks good, build passes. Changes accepted.

## 2026-11-23: tweeter-server/src/dao/dynamo/DynamoStatusDAO.ts (new file), tweeter-server/src/dao/dynamo/DynamoBatchRetry.ts (new file), tweeter-server/src/dao/dynamo/DynamoUserDAO.ts, tweeter-server/src/dao/dynamo/DynamoDAOFactory.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Implement DynamoStatusDAO (story and feed tables, paging through the shared helper, feed fan-out with BatchWrite in chunks of 25) and return it from DynamoDAOFactory; move DynamoUserDAO's unprocessed-retry/backoff loop and sleep() into a shared helper used by both DAOs without changing UserDAO behavior.
- Review: Retrying logic moved out of a single file, and looking good still. Factory looking good, new path built. Both status and feed things are in the same DAO and it's looking a bit big, but I don't think the switch is worth the works since I can still find everything in it. Changes accepted.
## 2026-11-23: N/A
- Tool: Claude chat
- Task: Got help figuring out how to word the image uploading task so it would include the code the project spec told me I should use, and how to direct it to use S3.
- Revew: it was good :)

## 2026-11-23: tweeter-server/src/dao/s3/S3ImageDAO.ts (new file), tweeter-server/src/dao/dynamo/DynamoConfig.ts, tweeter-server/src/dao/dynamo/DynamoDAOFactory.ts, tweeter-server/tsconfig.json, AGENTS.md, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Implement S3ImageDAO from the spec's putImage code with an injected shared S3Client, bucket/region in config, ContentType from the file extension, public-read ACL, and [internal-server-error] on failure, and return it from DynamoDAOFactory; no interface or service changes.
- Review: AI Caught a mistake I made in my instructions in AGENTS.md and something missing from my config file so that's cool and fixed. Last factory thing added appropriately. Code from the suggested way to do images translated over without change. All looking good. Build still works, nothing broken. Changes accepted.
## 2026-11-23: tweeter-server/src/model/service/AuthorizationService.ts (new file), tweeter-server/src/lambda/DAOFactoryInstance.ts (new file), tweeter-server/src/model/service/FollowService.ts, tweeter-server/src/model/service/StatusService.ts, tweeter-server/src/model/service/UserService.ts, tweeter-server/src/lambda/follow/FollowLambda.ts, tweeter-server/src/lambda/follow/GetFolloweeCountLambda.ts, tweeter-server/src/lambda/follow/GetFolloweesLambda.ts, tweeter-server/src/lambda/follow/GetFollowerCountLambda.ts, tweeter-server/src/lambda/follow/GetFollowersLambda.ts, tweeter-server/src/lambda/follow/GetIsFollowerStatusLambda.ts, tweeter-server/src/lambda/follow/UnfollowLambda.ts, tweeter-server/src/lambda/status/GetFeedLambda.ts, tweeter-server/src/lambda/status/GetStoryLambda.ts, tweeter-server/src/lambda/status/PostStatusLambda.ts, tweeter-server/src/lambda/user/GetUserLambda.ts, tweeter-server/src/lambda/user/LoginLambda.ts, tweeter-server/src/lambda/user/LogoutLambda.ts, tweeter-server/src/lambda/user/RegisterLambda.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Create AuthorizationService (createSession, authorize, endSession; TOKEN_LIFETIME_SECONDS = 3600, expiresAt in epoch seconds) and give every service a DAOFactory constructor, with one shared DynamoDAOFactory instance the lambdas pass in; check template.yaml for the [unauthorized] 401 mapping. No FakeData replacement and no authorize() calls yet.
- Review: DAOFactoryInstance set up to initialize the one factory, then passed into all the services via the lambdas. Authorization service does everything I need, lambads are not changed except for the importing and passing in the DAOFactory. Changes accepted.
## 2026-11-23: N/A
- Tool: Claude chat
- Task: Got help coming up with what I wanted the tests to do in my task prompt.
- Revew: it was good :)
## 2026-11-23: tweeter-server/src/model/service/UserService.ts, tweeter-server/test/fakes/FakeDAOs.ts (new file), tweeter-server/test/fakes/FakeDAOFactory.ts (new file), tweeter-server/test/model/service/UserService.test.ts (new file), tweeter-server/test/lambda/LoginLambda.test.ts, tweeter-server/test/lambda/RegisterLambda.test.ts, tweeter-server/test/lambda/GetUserLambda.test.ts, tweeter-server/test/lambda/LogoutLambda.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Replace FakeData in UserService (login, register, logout, getUser) with DAOs from the DAOFactory, bcryptjs hashing, and AuthorizationService, and write UserService unit tests using reusable in-memory fake DAOs and a fake DAOFactory.
- Review: Everything in UserService that had a TODO replace with actual stuff comment has now had it replaced with actual stuff! Login no longer just works, you need an actual registered account first. Register works creating a new account, and sends in and stored images appropriately. Login works AFTER registering just fine. Tests the agent wrote look pretty good, and the old tests are modified to look for actual auth tokens instead of fake ones. Changes accepted.
## 2026-11-23: tweeter-server/src/model/service/FollowService.ts, tweeter-server/test/model/service/FollowService.test.ts (new file), tweeter-server/test/lambda/FollowLambda.test.ts, tweeter-server/test/lambda/UnfollowLambda.test.ts, tweeter-server/test/lambda/GetFolloweesLambda.test.ts, tweeter-server/test/lambda/GetFollowersLambda.test.ts, tweeter-server/test/lambda/GetFolloweeCountLambda.test.ts, tweeter-server/test/lambda/GetFollowerCountLambda.test.ts, tweeter-server/test/lambda/GetIsFollowerStatusLambda.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Replace FakeData in FollowService (paging, counts, follow, unfollow, getIsFollowerStatus) with DAOs from the DAOFactory and AuthorizationService, and write FollowService unit tests using the existing fake DAOs and fake factory.
- Review: Follow service heavily modified to get rid of all TODO things. Constrouctor uses injection well. GetFollowCounts completely reworked. Tests all pass. Practical visit shows that there is nothing there in the followees and followers tab, 

## 2026-11-23: tweeter-server/src/model/service/StatusService.ts, tweeter-server/test/model/service/StatusService.test.ts (new file), tweeter-server/test/lambda/GetStoryLambda.test.ts, tweeter-server/test/lambda/GetFeedLambda.test.ts, tweeter-server/test/lambda/PostStatusLambda.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Replace FakeData in StatusService (loadMoreStoryItems, loadMoreFeedItems, postStatus) with StatusDAO/FollowDAO and AuthorizationService, and write unit tests for it.
- Review: StatusService now uses the DAOs exclusively. Checks for authorization, then uses appropriate DAO functions. Starst constrcuting feeds. Tests chagned to accomodate no longer expecting FakeData, and tests all pass. When testing by visiting the page basically nothing appears, as expected for this stage. Changes Accepted

## 2026-11-23: tweeter-server/src/model/service/AliasUtils.ts (new file), tweeter-server/src/model/service/UserService.ts, tweeter-server/test/model/service/UserService.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Add a reusable normalizeAlias helper that adds a missing "@" to aliases, use it in register and login before any DAO calls (S3 file name still has no "@"), and add UserService tests for it.
- Review: TODO

## 2026-11-23: tweeter-server/scripts/seed.ts (new file), tweeter-server/scripts/tsconfig.json (new file), AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Write a rerunnable seed script that fills DynamoDB through DynamoDAOFactory with 25 users plus @seeduser (15+ followees, 15+ followers, 15+ story statuses, 15+ feed items), paced for 4 WCU per table. Not run.
- Review: If it works, it's good. It does not. Changes needed before accepting. 

## 2026-11-23: tweeter-server/scripts/seed.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Extend the seed script so the @userN accounts also follow each other, with varied follower and followee counts per user.
- Review: Script works now!

## 2026-11-23: tweeter-web/src/presenter/UserInfoPresenter.ts, tweeter-web/src/components/userInfo/UserInfoComponent.tsx, tweeter-web/test/presenter/UserInfoPresenter.test.ts (new file), AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Fix follower/followee counts always showing the logged-in user's counts (18/18) on every user's page, caused by the presenter keeping the first render's view, and add a presenter unit test that would have caught it.
- Review: Fixed my misuse of MVP. Changes approved.

## 2026-11-23: tweeter-web/test/network/ServerFacade.test.ts, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Update the ServerFacade integration tests to stop expecting FakeData and instead check against the seed script's data, logging in as @seeduser for a real auth token. Not run.
- Review: Now they are run. All pass, and now use a seed user. Checks actual stuff now, all tests appear to do what they say, and I can break them by changing values. Changes accepted.

## 2026-11-24: tweeter-web/src/presenter/PostStatusPresenter.ts, tweeter-web/src/components/postStatus/PostStatus.tsx, tweeter-web/test/components/postStatus/PostStatus/PostStatus.test.tsx, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Fix posted statuses having empty text, caused by the presenter reading the post through the first render's stale view.getPost; pass the post text into submitPost instead, and add a component test with the real presenter that would have caught it.
- Review: tested the solution in browser and it works. However now suddenly a bunch of tests are failing. OK after reviewing the test this is not due to these changes, but due to me having written overly strict tests that are now failing due to me having added new story posts. Changes accepted.

## 2026-11-24: tweeter-web/src/presenter/PostStatusPresenter.ts, tweeter-web/src/components/postStatus/PostStatus.tsx, AI-ATTRIBUTION.md
- Tool: Claude Code (Claude Opus 5.5)
- Task: Remove the stale isLoading field from PostStatusView, which meant also removing the unused oldcheckButtonStatus method, the only code that read it.
- Review: TODO
