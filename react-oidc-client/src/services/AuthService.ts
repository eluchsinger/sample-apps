import { Log, User, UserManager } from 'oidc-client';
import  crypto from 'crypto';
import base64url from "base64url";
import { createAuthorizationUrl } from './authorizationUrl';

export class AuthService {
  public userManager: UserManager;

  constructor() {
    const settings = {
      authority: process.env.REACT_APP_STSAUTHORITY,
      client_id: process.env.REACT_APP_CLIENTID,
      redirect_uri: `${process.env.REACT_APP_CLIENTROOT}/signin-callback.html`,
      // tslint:disable-next-line:object-literal-sort-keys
      post_logout_redirect_uri: `${process.env.REACT_APP_CLIENTROOT}`,
      response_type: 'code',
      prompt: 'login',
      scope: 'openid ' + process.env.REACT_APP_CLIENTSCOPE,
      loadUserInfo: false
    };
    this.userManager = new UserManager(settings);

    Log.logger = console;
    Log.level = Log.DEBUG;
  }

  public getUser(): Promise<User | null> {
    return this.userManager.getUser();
  }

  public login = async (): Promise<void> => {

    const nonce = base64url(crypto.randomBytes(32));

    const state = base64url(crypto.randomBytes(32));
    const randomBytes = crypto.randomBytes(32);
     const verifier = base64url(randomBytes);
    // console.log(verifier)
     //const hashedRandomBytes = await kms.digest(DigestAlgorithm.sha256, stringToBytes(verifier));
     const challenge = base64url(crypto.createHmac('sha256', verifier).digest('base64'))
     console.log("Challenge ", challenge)
    // const challenge = base64UrlEncodeNoPadding(Buffer.from(hashedRandomBytes));

    localStorage.setItem("verifier", verifier);
    localStorage.setItem("challenge", challenge);
    const authorizationUrl = await createAuthorizationUrl({
      authorizationEndpoint: `${process.env.REACT_APP_STSAUTHORITY}/authorize`,
      scope: "openid openid_credential",
      clientId: process.env.REACT_APP_CLIENTID || "",
      responseType: "code",
      codeChallenge: challenge,
      codeChallengeMethod: "S256",
      state,
      nonce,
      prompt: "login",
      redirect_uri: `${process.env.REACT_APP_CLIENTROOT}/signin-callback.html`,
    });
     window.open(authorizationUrl);
  }

  public renewToken(): Promise<User> {
    return this.userManager.signinSilent();
  }

  public logout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }
}
