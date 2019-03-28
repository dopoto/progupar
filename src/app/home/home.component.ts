import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth-service/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService ) { }

  ngOnInit() {
  }

  login(){
    debugger;
    this.authService.login();
  }
}
