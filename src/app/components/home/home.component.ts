import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GithubApiService } from 'src/app/services/github-api/github-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  profile: any;

  constructor(private authService: AuthService, private githubApiService: GithubApiService) { }

  ngOnInit() {
    this.getUser();
  }

  login(){
    this.authService.login();
  }

  getUser(): string {
    this.githubApiService.getUser("dopoto");
    return "";
  }

  submitChange() {
    this.githubApiService.submitChange("dopoto", "progupar");
  }

  getProfile() {
    if (this.authService.userProfile) {
      this.profile = this.authService.userProfile;
    } else {
      this.authService.getProfile((err, profile) => {
        debugger;
        this.profile = profile;
      });
    }
  }
}
