# AGENTS.md

## Project
Tweeter (Twitter clone). TypeScript monorepo:
- tweeter-web/ — React client (MVP: presenters, services, views)
- tweeter-shared/ — shared model classes + request/response types
- tweeter-server/ — AWS Lambda handlers + server-side services
Milestone 3: move service logic to Lambdas behind API Gateway; client
calls them via ServerFacade -> ClientCommunicator. Server returns FakeData.

## Commands
- Build: npm run build
- Test: npm run test
- Type check: npx tsc --noEmit

## Conventions
- All endpoints use POST; auth token goes in the JSON request body
- Use named exports, not default exports
- Do not use the `any` type
- Requests/responses live in tweeter-shared and extend TweeterRequest/TweeterResponse
- Lambdas only parse the request, call a service, and build the response; no logic

## Off-limits
- Do not edit files in src/generated/ (the build produces them)
- Do not add npm dependencies without asking
- Do not commit or run git commands
- Do not run deploy scripts, AWS CLI commands, or anything touching AWS

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