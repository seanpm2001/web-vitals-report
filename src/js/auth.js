/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Utility methods for dealing with Google auth:
// https://developers.google.com/identity/oauth2/web/guides/use-token-model

let tokenClient;
let accessToken;

export async function initAuthClient(postAuthFunction) {
  tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: window.clientId,
      scope: window.scope,
      callback: (tokenResponse) => {
        accessToken = tokenResponse.access_token;
        // store token in sessionStorage for page reloads
        sessionStorage.setItem("access_token", accessToken);
        postAuthFunction();
      },
  });
}

export async function signoutAccessToken() {
  window.google.accounts.oauth2.revoke(accessToken);
  accessToken = null;
  sessionStorage.removeItem("access_token");
}

export async function refreshAccessToken() {
  tokenClient.requestAccessToken();
  // store token in sessionStorage for page reloads
  sessionStorage.setItem("access_token", accessToken);
  return getAccessToken();;
}

export async function checkAuthStatus() {
  return !!getAccessToken();
}

// Should only be called if the user is signed in
// but even if it's blank or invalid, the API call will fail
// and then authentication screen will be shown again.
export function getAccessToken() {

  // If token is not set, then check sessionStorage (in case of page reloads)
  if (!accessToken) {
    accessToken = sessionStorage.getItem("access_token");
  }
  return accessToken;
}
