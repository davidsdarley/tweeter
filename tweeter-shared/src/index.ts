// AI-assisted: see AI-ATTRIBUTION.md

//Domain classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { User } from "./model/domain/User";
export { AuthToken } from "./model/domain/AuthToken";


// DTOs
export type { UserDto } from "./model/dto/UserDto";
export type { StatusDto } from "./model/dto/StatusDto";
export type { AuthTokenDto } from "./model/dto/AuthTokenDto";

// Requests
export type { PagedUserItemRequest } from "./model/net/request/PagedUserItemRequest";
export type { PagedStatusItemRequest } from "./model/net/request/PagedStatusItemRequest";
export type { TweeterRequest } from "./model/net/request/TweeterRequest";
export type { IsFollowerRequest } from "./model/net/request/IsFollowerRequest";
export type { PostStatusRequest } from "./model/net/request/PostStatusRequest";
export type { LoginRequest } from "./model/net/request/LoginRequest";
export type { RegisterRequest } from "./model/net/request/RegisterRequest";

// Responses
export type { PagedUserItemResponse } from "./model/net/response/PagedUserItemResponse";
export type { PagedStatusItemResponse } from "./model/net/response/PagedStatusItemResponse";
export type { TweeterResponse } from "./model/net/response/TweeterResponse";
export type { GetUserResponse } from "./model/net/response/GetUserResponse";
export type { GetCountResponse } from "./model/net/response/GetCountResponse";
export type { IsFollowerResponse } from "./model/net/response/IsFollowerResponse";
export type { FollowResponse } from "./model/net/response/FollowResponse";
export type { AuthResponse } from "./model/net/response/AuthResponse";

// Fake data
export { FakeData } from "./util/FakeData";
