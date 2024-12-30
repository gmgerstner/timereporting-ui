import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginCredentials } from 'src/app/models/LoginCredentials';
import { TimeReportingApiService } from '../../services/time-reporting-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loggingIn: boolean = false;
  username: string = "";
  password: string = "";
  rememberLogin: boolean = false;

  constructor(
    private router: Router,
    private api: TimeReportingApiService
  ) { }

  ngOnInit(): void {
    let value = <boolean>(localStorage.getItem(TimeReportingApiService.rememberLoginKey) ?? false);
    this.rememberLogin = value;
    if (this.rememberLogin) {
      this.username = localStorage.getItem(TimeReportingApiService.usernameKey) ?? "";
      this.password = localStorage.getItem(TimeReportingApiService.passwordKey) ?? "";
    }
  }

  onLoginClick() {
    this.loggingIn = true;
    let credentials: LoginCredentials =
    {
      username: this.username,
      password: this.password
    };
    this.api.login(credentials)
      .subscribe(u => {
        this.loggingIn = false;
        if (u != null) {
          localStorage.setItem(TimeReportingApiService.rememberLoginKey, this.rememberLogin ? "true" : "false");
          if (this.rememberLogin) {
            localStorage.setItem(TimeReportingApiService.passwordKey, this.password);
          } else {
            localStorage.setItem(TimeReportingApiService.passwordKey, "");
          }

          this.api.setCredentials(u);
          this.router.navigate(["/"]);
        } else {
          alert("Invalid login");
        }
      }, err => {
        this.loggingIn = false;
        alert(`An error occured while loging in.`);
      });
  }

}
