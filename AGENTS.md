# AGENTS.md

## Project
Tweeter (Twitter clone). TypeScript monorepo:
- tweeter-web/ — React client (MVP: presenters, services, views)
- tweeter-shared/ — shared model classes + request/response types
- tweeter-server/ — AWS Lambda handlers + server-side services
Milestone 4A: replace FakeData in server services with a data access
layer (DAOs) backed by DynamoDB and S3. Add password hashing (bcryptjs)
and auth-token validation on every authenticated request.

## Commands
- tweeter-shared:
    - Build: npm run build
- tweeter-server:
    - Build: npm run build
    - Test: npm run test
- tweeter-web:
    - Build: npm run build
    - Test: npm run test, npx tsc --noEmit

## Conventions
- All endpoints use POST; auth token goes in the JSON request body
- Endpoint paths are /<resource>/<action>, e.g. /followees/get
- Each endpoint needs TWO blocks in tweeter-server/template.yaml: a path under
  tweeterApi `paths:` and a function resource. Path and function ID must match
  between them. Handler is relative to dist/ (e.g. lambda/follow/GetFolloweesLambda.handler)
- Requests/responses live in tweeter-shared and extend TweeterRequest/TweeterResponse
- Imports: inside tweeter-shared use relative paths only; everywhere else import
  from "tweeter-shared" only, never a path into it
- File and import names must match casing exactly (Lambda runs on Linux)
- Use named exports, not default exports
- Do not use the `any` type
- Lambdas only parse the request, call a service, and build the response; no logic
- Lambdas wrap handlers in handleErrors; thrown errors use
  [bad-request]/[unauthorized]/[internal-server-error] prefixes

## Data layer
- DAO interfaces are database-agnostic: no AWS types or imports in them
- Services get DAOs from a DAOFactory; services never call `new` on a DAO
- All DynamoDB/S3 code lives in the dynamo and s3 DAO packages only
- Every authenticated service method validates the token through AuthorizationService first
- Never store or return plaintext passwords; hash with bcryptjs
- Reuse shared helpers (e.g. paging) instead of duplicating query code
- Tables:
    - user: PK alias
    - follows: PK follower_alias, SK followee_alias; GSI follows_index (PK followee_alias, SK follower_alias)
    - story: PK alias, SK timestamp (Number)
    - feed: PK alias (receiver), SK timestamp_alias (String "<timestamp>#<authorAlias>")
    - authtoken: PK token; expiresAt (Number, epoch seconds, TTL)
- Follower/followee counts are stored on the user item and updated on follow/unfollow

## Off-limits
- Do not edit dist/, layer/, or node_modules/ (generated)
- Do not add npm dependencies without asking
- Do not commit, stash, reset, or change git state
- Do not run sam, the AWS CLI, deploy scripts, or anything touching AWS

## AI attribution
After each task that changes files, append an entry to
AI-ATTRIBUTION.md in the repository root, creating the file if it does
not exist. Use this format, with today's date:
    ## YYYY-MM-DD: <each file changed, with (new file) after new ones>
    - Tool: <tool name>
    - Task: <the task I gave you, in one or two sentences>
    - Review: TODO
Leave the Review line as TODO. I fill it in after I review the change.
List every file you changed or created, including tests, and do not
list anything you did not change.

If a TypeScript file you created or changed does not already start
with this line, add it as the first line:
    // AI-assisted: see AI-ATTRIBUTION.md