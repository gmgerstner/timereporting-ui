import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimeReportingApiService } from '../../services/time-reporting-api.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  username: string = "";
  password: string = "";
  loggingIn: boolean = false;

  constructor(
    private router: Router,
    private api: TimeReportingApiService
  ) { }

  ngOnInit(): void {
  }

  currentUsername(): string | undefined {
    let username = localStorage.getItem("Username")?.toUpperCase();
    return username;
  }

  showLogout() {
    return this.api.loggedIn();
  }

  onLogout() {
    this.api.clearCredentials();
    this.username = "";
    this.password = "";
    this.router.navigate(["/", "login"]);
  }
}
