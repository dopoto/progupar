import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

import { GithubApiService } from '../github-api/github-api.service';
import { User } from 'src/app/models/user';
 

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  constructor(private api: GithubApiService) {}
}
