// AI-assisted: see AI-ATTRIBUTION.md
import { TweeterRequest, TweeterResponse } from "tweeter-shared";

export class ClientCommunicator {
  private SERVER_URL: string;

  public constructor(SERVER_URL: string) {
    this.SERVER_URL = SERVER_URL;
  }

  public async doPost<REQ extends TweeterRequest, RES extends TweeterResponse>(
    req: REQ | undefined,
    endpoint: string,
    headers?: Headers,
  ): Promise<RES> {
    if (headers && req) {
      headers.append("Content-type", "application/json");
    } else if (req) {
      headers = new Headers({
        "Content-type": "application/json",
      });
    }

    console.log(`The request body is '${JSON.stringify(req)}'`);

    const url = this.getUrl(endpoint);
    const params = this.getParams(
      "POST",
      headers,
      req ? JSON.stringify(req) : req,
    );

    console.log(`Fetching '${url}' with params '${JSON.stringify(params)}'`);

    try {
      const resp: Response = await fetch(url, params);

      if (resp.ok) {
        // Be careful with the return type here. resp.json() returns Promise<any> which means there is no type checking on response.
        const response: RES = await resp.json();
        return response;
      } else {
        // Our template.yaml mappings return { error }, but errors API Gateway
        // generates itself (e.g. a Lambda that fails to start) return { message }.
        const error: { error?: string; message?: string } = await resp
          .json()
          .catch(() => ({}));
        throw new Error(
          error.error || error.message || `HTTP ${resp.status} ${resp.statusText}`,
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error(
        `Client communicator ${params.method} failed:\n${
          (error as Error).message
        }`,
      );
    }
  }

  private getUrl(endpoint: string): string {
    return this.SERVER_URL + endpoint;
  }

  private getParams(
    method: string,
    headers?: Headers,
    body?: BodyInit,
  ): RequestInit {
    const params: RequestInit = { method: method };

    if (headers) {
      params.headers = headers;
    }

    if (body) {
      params.body = body;
    }

    return params;
  }
}