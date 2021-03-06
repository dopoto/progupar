import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { GitHubProfile } from 'src/app/models/gitHubProfile';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userProfile: GitHubProfile;

  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;

  auth0 = new auth0.WebAuth({
    clientID: 'dAqjlr1P591XesNqGizKhmVQfjVfKkTf',
    domain: 'progupar.eu.auth0.com',
    responseType: 'token id_token',
    redirectUri: 'http://localhost:4202/callback',
    scope: 'openid profile'
  });

  constructor(public router: Router, private httpClient: HttpClient) {
    this._idToken = '';
    this._accessToken = '';
    this._expiresAt = 0;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  public login(): void {
    this.auth0.authorize();
  }

  // ...
  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.localLogin(authResult);
        this.getProfile((err, profile) => {
          this.userProfile = profile;
        });

        this.getFullProfile$().subscribe((data) => {
          debugger;
        });

        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private localLogin(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = (authResult.expiresIn * 1000) + Date.now();
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;
  }

  public getProfile(cb): void {
    if (!this._accessToken) {
      throw new Error('Access Token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(this._accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }
// TODO Research - https://auth0.com/docs/connections/calling-an-external-idp-api > WebTasks
  public getFullProfile$(): Observable<any> {
    const url = 'https://progupar.eu.auth0.com/oauth/token';
    const body = '{"client_id":"psM3ZAqoQ603xCAqLzAaG6mZHMeKrWAz","client_secret":"UaveuyXg2mGQYLBP1tgFvBydGVTmBeofw65KBpmx7HASGWtjjxINCMIaLzyUws-n","audience":"https://progupar.eu.auth0.com/api/v2/","grant_type":"client_credentials"}';
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    return this.httpClient.post(url, body, { headers });
  }

  public renewTokens(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
      } else if (err) {
        alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
        this.logout();
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = '';
    this._idToken = '';
    this._expiresAt = 0;

    this.auth0.logout({
      return_to: window.location.origin
    });
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return this._accessToken && Date.now() < this._expiresAt;
  }

}