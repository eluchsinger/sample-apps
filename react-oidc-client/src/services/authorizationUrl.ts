/*
 * Copyright 2019 - MATTR Limited
 * All rights reserved
 * Confidential and proprietary
 */

import * as url from "url";

export type AuthorizationUrlProps = {
  readonly authorizationEndpoint: string;
  readonly scope: string;
  readonly clientId: string;
  readonly responseType: string;
  readonly codeChallenge: string;
  readonly codeChallengeMethod: string;
  readonly state: string;
  readonly nonce: string;
  readonly prompt: string;
  readonly request?: string;
  readonly redirect_uri: string;
  readonly provider?: string;
};

export const createAuthorizationUrl = (options: AuthorizationUrlProps): string => {
  const {
    authorizationEndpoint,
    scope,
    codeChallenge,
    codeChallengeMethod,
    state,
    nonce,
    prompt,
    provider,
    request,
    clientId,
    responseType,
    redirect_uri,
  } = options;

  const currentTarget = url.parse(authorizationEndpoint, true);
  const target = {
    ...currentTarget,
    search: undefined,
    query: {
      scope,
      /* eslint-disable @typescript-eslint/camelcase */
      client_id: clientId,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
      response_type: responseType,
      /* eslint-enable @typescript-eslint/camelcase */
      state,
      nonce,
      prompt,
      redirect_uri,
      ...(provider ? { provider } : {}),
      ...(request ? { request } : {}),
    },
  };

  return url.format(target);
};
