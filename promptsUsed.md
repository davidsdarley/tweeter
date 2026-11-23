## TASK 1
Add the getFollowers feature end to end, following the existing getFollowees implementation.

Objective: Implement loadMoreFollowers through the same layers as followees:
server FollowService method → new Lambda → template.yaml (both the API path block
and the function block) → ServerFacade.getMoreFollowers → client FollowService
calls ServerFacade instead of FakeData. Behavior and output must match what the
client gets from FakeData today.

Read first:
- tweeter-server/src/lambda/follow/GetFolloweesLambda.ts
- tweeter-server/src/model/service/FollowService.ts
- tweeter-server/template.yaml
- tweeter-server/test/lambda/GetFolloweesLambda.test.ts
- tweeter-web/src/network/ServerFacade.ts
- tweeter-web/src/model/service/FollowService.ts
- tweeter-shared/src/model/net/request/PagedUserItemRequest.ts
- tweeter-shared/src/model/net/response/PagedUserItemResponse.ts

Constraints:
- Endpoint path: /followers/get
- Function ID and FunctionName: getFollowersFunction
- Lambda file: tweeter-server/src/lambda/follow/GetFollowersLambda.ts, exporting `handler`
- Reuse PagedUserItemRequest/PagedUserItemResponse; do not modify tweeter-shared
  (ask me first if you think a change is needed)
- Mirror the followees code structure and naming; don't refactor followees
- Do not change presenters, views, or existing tests
- Do not add npm dependencies
- Do not run sam, aws, or deploy commands

Done when:
- New tweeter-server/test/lambda/GetFollowersLambda.test.ts covers: successful
  first page with pageSize items, output matches FakeData, second page via
  lastItem has no overlap, smaller pageSize respected
- In tweeter-server: npm run build and npm test pass
- In tweeter-web: npx tsc --noEmit passes

If the followees implementation looks inconsistent or wrong, stop and ask
instead of fixing it.

## TASK 2
Add the getFeed feature end to end, following the existing getFollowees implementation, using Status instead of User objects.

Objective: Implement loadMoreFeedItems through mostly the same layers as followees:
new shared types → server StatusService method → new Lambda → template.yaml
(both the API path block and the function block) → ServerFacade.getMoreFeedItems →
client StatusService calls ServerFacade instead of FakeData. Behavior and output
must match what the client gets from FakeData.
New shared types: PagedStatusItemRequest/PagedStatusItemResponse based on the
PagedUserItem equivalents, plus a StatusDto. Export them from tweeter-shared/src/index.ts.

Read first:
- tweeter-server/src/lambda/follow/GetFolloweesLambda.ts
- tweeter-server/src/model/service/FollowService.ts
- tweeter-server/template.yaml
- tweeter-server/test/lambda/GetFolloweesLambda.test.ts
- tweeter-web/src/network/ServerFacade.ts
- tweeter-web/src/model/service/StatusService.ts
- tweeter-shared/src/model/net/request/PagedUserItemRequest.ts
- tweeter-shared/src/model/net/response/PagedUserItemResponse.ts
- tweeter-shared/src/model/domain/Status.ts
- tweeter-shared/src/util/FakeData.ts
- tweeter-shared/src/index.ts

Constraints:
- Endpoint path: /feed/get
- Function ID and FunctionName: getFeedFunction
- Lambda file: tweeter-server/src/lambda/status/GetFeedLambda.ts, exporting `handler`
- Put server logic in tweeter-server/src/model/service/StatusService.ts, creating it if needed.
- While you should create new files in tweeter-shared, avoid changing existing files other than index.ts (ask me first if you think a change is needed)
- Mirror the followees code structure and naming; don't refactor followees
- Do not change presenters, views, or existing tests
- Do not add npm dependencies
- Do not run sam, aws, or deploy commands

Done when:
- New tweeter-server/test/lambda/GetFeedLambda.test.ts covers: successful
  first page with pageSize items, output matches FakeData, second page via
  lastItem has no overlap, smaller pageSize respected
- tweeter-web/test/network/ServerFacade.test.ts is updated to test that getMoreFeedItems returns the next page with no overlap
  and respects a smaller page size, same as getMoreFollowees and getMoreFollowers
- In tweeter-shared: npm run build with no build issues
- In tweeter-server: npm run build and npm test pass
- In tweeter-web: npx tsc --noEmit passes

If the followees implementation looks inconsistent or wrong, stop and ask
instead of fixing it.

## TASK 3
Add the getStory feature end to end, following the existing getFeed implementation.

Objective: Implement loadMoreStoryItems through the same layers as feed:
server StatusService method → new Lambda → template.yaml
(both the API path block and the function block) → ServerFacade.getMoreStoryItems →
client StatusService calls ServerFacade instead of FakeData. Behavior and output
must match what the client gets from FakeData.

Read first:
- tweeter-server/src/lambda/status/GetFeedLambda.ts
- tweeter-server/src/model/service/StatusService.ts
- tweeter-server/template.yaml
- tweeter-server/test/lambda/GetFeedLambda.test.ts
- tweeter-web/src/network/ServerFacade.ts
- tweeter-web/src/model/service/StatusService.ts
- tweeter-shared/src/model/net/request/PagedStatusItemRequest.ts
- tweeter-shared/src/model/net/response/PagedStatusItemResponse.ts
- tweeter-shared/src/model/domain/Status.ts
- tweeter-shared/src/util/FakeData.ts
- tweeter-shared/src/index.ts

Constraints:
- Endpoint path: /story/get
- Function ID and FunctionName: getStoryFunction
- Lambda file: tweeter-server/src/lambda/status/GetStoryLambda.ts, exporting `handler`
- Put server logic in tweeter-server/src/model/service/StatusService.ts.
- Do not modify tweeter-shared (ask me first if you think a change is needed)
- Mirror the feed code structure and naming; don't refactor feed
- Do not change presenters, views, or existing tests
- Do not add npm dependencies
- Do not run sam, aws, or deploy commands

Done when:
- New tweeter-server/test/lambda/GetStoryLambda.test.ts covers: successful
  first page with pageSize items, output matches FakeData, second page via
  lastItem has no overlap, smaller pageSize respected
- tweeter-web/test/network/ServerFacade.test.ts is updated to test that getMoreStoryItems returns the next page with no overlap and respects a smaller page size, same as getMoreFollowees and getMoreFollowers
- In tweeter-shared: npm run build with no build issues
- In tweeter-server: npm run build and npm test pass
- In tweeter-web: npx tsc --noEmit passes

If the feed implementation looks inconsistent or wrong, stop and ask
instead of fixing it.

## TASK 4
Move counting and user access logic from tweeter-web/src/model.service/UserService to the new tweeter-server/src/model/service/UserService.ts. tweeter-server/src/model/service/UserService.ts is set up end to end. 

Objective: transfer the functionality of getUser, getFolloweeCount, getFollowerCount, and getIsFollowerStatus from tweeter-web/src/model.service/UserService to the newly created tweeter-server/src/model/service/UserService.ts 
Each function should set up the same layers as the Status service classes, server method → new Lambda → template.yaml (both the API path block and the function block) → ServerFacade.method → client UserService calls ServerFacade for the replaced methods instead of FakeData. Behavior and output must match what the client gets from FakeData today.
Create DTO, request, and response classes as necessary to follow the existing logical flow.

Read first:
- tweeter-web/src/model/service/UserService.ts
- tweeter-server/src/lambda/status/GetFeedLambda.ts
- tweeter-server/src/model/service/StatusService.ts
- tweeter-server/template.yaml
- tweeter-server/test/lambda/GetFeedLambda.test.ts
- tweeter-web/src/network/ServerFacade.ts
- tweeter-shared/src/model/net/request/PagedStatusItemRequest.ts
- tweeter-shared/src/model/net/response/PagedStatusItemResponse.ts
- tweeter-shared/src/model/domain/User.ts
- tweeter-shared/src/util/FakeData.ts
- tweeter-shared/src/index.ts

Constraints:
- Endpoint path: /story/get
- Function ID and FunctionName: same as in tweeter-web's UserService for each function
- Lambda file: tweeter-server/src/lambda/user/<methodName>.ts, exporting `handler`
- Put server logic in tweeter-server/src/model/service/UserService.ts.
- other than index.ts, do not modify existing files in tweeter-shared (ask me first if you think a change is needed). Create new files as necessary.
- Mirror the feed code structure and naming; don't refactor feed
- Do not change presenters, views, or existing tests
- Do not add npm dependencies
- Do not run sam, aws, or deploy commands

Done when:
- You have written new tweeter-server/test/lambda/<method>.test.ts, covering successful requests for each method.
- tweeter-web/test/network/ServerFacade.test.ts is updated to test each method.
- In tweeter-shared: npm run build with no build issues
- In tweeter-server: npm run build and npm test pass
- In tweeter-web: npx tsc --noEmit passes

If the existing implementation looks inconsistent or wrong, stop and ask
instead of fixing it.

## TASK 5
Move follow and unfollow logic from tweeter-web to tweeter-server/src/model/service/FollowService.ts.

Objective: transfer the functionality of follow and unfollow from UserInfoPresenter to tweeter-server/src/model/service/FollowService.ts. tweeter-web/src/model.service/FollowService gets new follow() and unfollow() methods, which UserInfoPresenter should call in order to access the functionality in the server.
Each function should set up the same layers as the Status service classes, server method → new Lambda → template.yaml (both the API path block and the function block) → ServerFacade.method → client FollowService calls ServerFacade for the replaced methods instead of FakeData. Behavior and output must match what the client gets from FakeData today.

Read first:
- tweeter-web/src/presenter/UserInfoPresenter.ts
- tweeter-web/src/model/service/FollowService.ts
- tweeter-server/src/lambda/status/GetFeedLambda.ts
- tweeter-server/src/model/service/StatusService.ts
- tweeter-server/template.yaml
- tweeter-server/test/lambda/GetFeedLambda.test.ts
- tweeter-web/src/network/ServerFacade.ts
- tweeter-shared/src/model/net/request/PagedUserItemRequest.ts
- tweeter-shared/src/model/dto/UserDto.ts
- tweeter-shared/src/model/domain/User.ts
- tweeter-shared/src/util/FakeData.ts
- tweeter-shared/src/index.ts

Constraints:
- Function ID and FunctionName: follow the conventions in the template.yaml file as they currently exist
- Lambda file: tweeter-server/src/lambda/follow/<methodName>.ts, exporting `handler`
- Put server logic in tweeter-server/src/model/service/FollowService.ts.
- Do not modify tweeter-shared (ask me first if you think a change is needed).
- Mirror the feed code structure and naming; don't refactor feed
- Other than UserInfoPresenter.ts, do not change presenters, views, or existing tests (ask me if you think such a change is necessary)
- Do not add npm dependencies
- Do not run sam, aws, or deploy commands

Done when:
- You have written new tweeter-server/test/lambda/<method>.test.ts for both follow and unfollow, covering successful requests for each method.
- tweeter-web/test/network/ServerFacade.test.ts is updated to test both the follow and unfollow methods.
- In tweeter-shared: npm run build with no build issues
- In tweeter-server: npm run build and npm test pass
- In tweeter-web: npx tsc --noEmit passes

If you have any questions about current implementations or instructions, stop and ask me. Avoid making assumptions when it is reasonable to do so.

## TASK 6
Move postStatus logic from tweeter-web to tweeter-server/src/model/service/StatusService.ts.

Objective: transfer the functionality of postStatus from tweeter-web/src/model.service/StatusService.ts to tweeter-server/src/model/service/StatusService.ts. 
The function should set up the same layers as other StatusService methods, server method → new Lambda → template.yaml (both the API path block and the function block) → ServerFacade.method → client StatusService calls ServerFacade for the replaced methods instead of FakeData. Behavior and output must match what the client gets from FakeData today.

Read first:
- tweeter-web/src/model.service/StatusService.ts
- tweeter-server/src/lambda/status/GetFeedLambda.ts
- tweeter-server/src/model/service/StatusService.ts
- tweeter-server/template.yaml
- tweeter-web/src/network/ServerFacade.ts
- tweeter-shared/src/model/net/request/PagedStatusItemRequest.ts
- tweeter-shared/src/model/dto/StatusDto.ts
- tweeter-shared/src/model/domain/Status.ts
- tweeter-shared/src/util/FakeData.ts
- tweeter-shared/src/index.ts

Constraints:
- Function ID and FunctionName: follow the conventions in the template.yaml file as they currently exist
- Lambda file: tweeter-server/src/lambda/status/<methodName>.ts, exporting `handler`
- Put server logic in tweeter-server/src/model/service/StatusService.ts.
- Do not modify tweeter-shared (ask me first if you think a change is needed).
- Mirror the feed code structure and naming; don't refactor feed
- Do not change presenters, views, or existing tests (ask me if you think such a change is necessary)
- Do not add npm dependencies
- Do not run sam, aws, or deploy commands

Done when:
- You have written new tweeter-server/test/lambda/<method>.test.ts for postStatus, covering a successful request for the method.
- tweeter-web/test/network/ServerFacade.test.ts is updated to test the updated postStatus method.
- In tweeter-shared: npm run build with no build issues
- In tweeter-server: npm run build and npm test pass
- In tweeter-web: npx tsc --noEmit passes

If you have any questions about current implementations or instructions, stop and ask me. Avoid making assumptions when it is reasonable to do so.


## TASK 7
Move logout logic from tweeter-web to tweeter-server/src/model/service/UserService.ts.

Objective: transfer the functionality of logout from tweeter-web/src/model.service/UserService.ts to tweeter-server/src/model/service/UserService.ts. 
The function should set up the same layers as other UserService methods, server method → new Lambda → template.yaml (both the API path block and the function block) → ServerFacade.method → client UserService calls ServerFacade for the replaced methods instead of FakeData. Behavior and output must match what the client gets from FakeData today.

Read first:
- tweeter-web/src/model.service/UserService.ts
- tweeter-server/src/lambda/user/GetUserLambda.ts
- tweeter-server/src/model/service/UserService.ts
- tweeter-server/template.yaml
- tweeter-web/src/network/ServerFacade.ts
- tweeter-shared/src/model/net/request/PagedUserItemRequest.ts
- tweeter-shared/src/model/dto/UserDto.ts
- tweeter-shared/src/model/domain/Status.ts
- tweeter-shared/src/util/FakeData.ts
- tweeter-shared/src/index.ts

Constraints:
- Function ID and FunctionName: follow the conventions in the template.yaml file as they currently exist
- Lambda file: tweeter-server/src/lambda/user/<methodName>.ts, exporting `handler`
- Put server logic in tweeter-server/src/model/service/UserService.ts.
- Do not modify tweeter-shared (ask me first if you think a change is needed).
- Mirror the feed code structure and naming; don't refactor feed
- Do not change presenters, views, or existing tests (ask me if you think such a change is necessary)
- Do not add npm dependencies
- Do not run sam, aws, or deploy commands

Done when:
- You have written new tweeter-server/test/lambda/<method>.test.ts for logout, covering a successful request for the method.
- tweeter-web/test/network/ServerFacade.test.ts is updated to test the updated logout method.
- In tweeter-shared: npm run build with no build issues
- In tweeter-server: npm run build and npm test pass
- In tweeter-web: npx tsc --noEmit passes

If you have any questions about current implementations or instructions, stop and ask me. Avoid making assumptions when it is reasonable to do so.

## TASK 8
Move login and register logic from tweeter-web to tweeter-server/src/model/service/UserService.ts.

Objective: transfer the functionality of login() and register() from tweeter-web/src/model.service/UserService.ts to tweeter-server/src/model/service/UserService.ts. 
The functions should set up the same layers as other UserService methods, server method → new Lambda → template.yaml (both the API path block and the function block) → ServerFacade.method → client UserService calls ServerFacade for the replaced methods instead of FakeData. Behavior and output must match what the client gets from FakeData today.

Read first:
- tweeter-web/src/model.service/UserService.ts
- tweeter-server/src/lambda/user/GetUserLambda.ts
- tweeter-server/src/model/service/UserService.ts
- tweeter-server/template.yaml
- tweeter-web/src/network/ServerFacade.ts
- tweeter-shared/src/model/net/request/PagedUserItemRequest.ts
- tweeter-shared/src/model/dto/UserDto.ts
- tweeter-shared/src/model/domain/Status.ts
- tweeter-shared/src/util/FakeData.ts
- tweeter-shared/src/index.ts

Constraints:
- Function ID and FunctionName: follow the conventions in the template.yaml file as they currently exist
- Lambda file: tweeter-server/src/lambda/user/<methodName>.ts, exporting `handler`
- Put server logic in tweeter-server/src/model/service/UserService.ts.
- Do not modify tweeter-shared (ask me first if you think a change is needed).
- Mirror the feed code structure and naming; don't refactor feed
- Do not change presenters, views, or existing tests (ask me if you think such a change is necessary)
- Do not add npm dependencies
- Do not run sam, aws, or deploy commands

Done when:
- You have written new tweeter-server/test/lambda/<method>.test.ts for login and register, covering a successful request for the method.
- tweeter-web/test/network/ServerFacade.test.ts is updated to test the updated login and register methods.
- In tweeter-shared: npm run build with no build issues
- In tweeter-server: npm run build and npm test pass
- In tweeter-web: npx tsc --noEmit passes

If you have any questions about current implementations or instructions, stop and ask me. Avoid making assumptions when it is reasonable to do so.

## Task 9
Add API documentation descriptions to tweeter-server/template.yaml.

Objective: For every endpoint under tweeterApi `paths:`, add a `description:`
under its `post:` explaining what the endpoint does, what the request contains,
and what the response returns.

Read first: tweeter-server/template.yaml, the Lambda and service for each endpoint,
and the request/response types in tweeter-shared.

Constraints:
- Only add description lines; change nothing else in template.yaml
- One or two sentences each, plain and specific
- Do not run sam, aws, or deploy commands

Done when: 
- every path has a description

If you have any questions about current implementations or instructions, stop and ask me. Avoid making assumptions when it is reasonable to do so.

## TASK 10
Add consistent error handling to all Lambdas so API Gateway returns correct status codes.

Objective: Set up so errors thrown by Lambdas are prefixed so template.yaml's response
mappings return 400/500 instead of 200.

Read first: 
- tweeter-server/template.yaml
- all files in tweeter-server/src/lambda/ 
- all files in tweeter-server/src/model/service/
- tweeter-web/src/network/ClientCommunicator.ts

Constraints:
- Create tweeter-server/src/lambda/handleErrors.ts exporting handleErrors(operation):
  rethrow errors whose message starts with "[" unchanged; wrap all others as
  "[internal-server-error] <message>"
- Wrap every Lambda handler body in handleErrors; make no other Lambda changes
- In server services, throw "[bad-request] <reason>" when a required request field
  is missing or invalid (empty alias, missing token, pageSize <= 0). Ask me before
  adding any other validation.
- In ClientCommunicator, change the error branch to read 'error.error ?? error.errorMessage'
- Do not use the [unauthorized] prefix yet
- Do not change template.yaml, presenters, views, or tweeter-shared
- Do not run sam, aws, or deploy commands
- Do not add npm dependencies


Done when:
- Each Lambda test file has at least one test that a bad request rejects with "[bad-request]"
- A test for handleErrors covers: prefixed error passes through, unprefixed error
  becomes [internal-server-error]
- In tweeter-server: npm run build and npm test pass
- In tweeter-web: npx tsc --noEmit passes

If you have any questions about current implementations or instructions, stop and ask me. Avoid making assumptions when it is reasonable to do so.

## TASK 11
Diagnose source of error causing Register to fail.

Objective: Whenever Register is called in the dev server with all the proper field , we receive an error message reading "Failed to register user because of exception: Client communicator POST failed:". Find and diagnose the cause of the error, then report it to me.

Read first: tweeter-web/src/App.tsx, tweeter-web/src/components/authentication/register/Register.tsx,  tweeter-web/src/presenter/RegisterPresenter, tweeter-web/src/model.service/UserService, tweeter-web/src/network/ServerFacade, tweeter-web/src/network/ClientCommunicator, and all of tweeter-server

Constraints:
- Focus on finding and diagnosing the issue, not fixing it yet.
- You may write any tests you wish to test anything.
- Do not change any existing files without asking permission first.
- Do not run sam, aws, or deploy commands
- Do not add npm dependencies


Done when:
- You have located which file is causing the incorrect behavior.

If you have any questions about current implementations or instructions, stop and ask me. Avoid making assumptions when it is reasonable to do so.