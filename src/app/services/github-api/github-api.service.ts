import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {

  constructor(private http: HttpClient) {}

  getUser(username: string) {
    const endPoint = `https://api.github.com/users/${username}`;
    this.http.get(endPoint).subscribe(data => {
      debugger;
    });
  }
}