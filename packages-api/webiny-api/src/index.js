import Api from "./api";
import Services from "./etc/services";

const serviceManager = new Services();

export const api: Api = new Api(serviceManager);
export const services: Services = serviceManager;
export { default as middleware } from "./middleware";
export { default as versionFromUrl } from "./etc/versionFromUrl";
export { default as versionFromHeader } from "./etc/versionFromHeader";
export { default as App } from "./etc/app";
export { Entity } from "./entity";
export { ApiErrorResponse, ApiResponse } from "./response";
export { Endpoint, EntityEndpoint, ApiContainer, ApiMethod, MatchedApiMethod } from "./endpoint";
export { default as endpointMiddleware } from "./middleware/endpoint";
