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
