export { Follow } from "tweeter-shared/src/model/domain/Follow";
export { PostSegment, Type } from "tweeter-shared/src/model/domain/PostSegment";
export { Status } from "tweeter-shared/src/model/domain/Status";
export { User } from "tweeter-shared/src/model/domain/User";
export { AuthToken } from "tweeter-shared/src/model/domain/AuthToken";

// All classes that should be avaialble to other modules need to exported here. export * does not work when 
// uploading to lambda. Instead we have to list each export.
export { FakeData } from "tweeter-shared/src/util/FakeData";
