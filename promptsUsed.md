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