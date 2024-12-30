import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TimeReportingApiService } from '../services/time-reporting-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private api: TimeReportingApiService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let systemUsername = localStorage.getItem("Username");

    if (systemUsername !== null && systemUsername !== "") {
      let setting = localStorage.getItem("Expires");
      let expires: string = setting != null ? setting : "";
      let now: Date = new Date();
      let dt: Date = new Date(expires);
      if (dt > now) {
        return true;
      } else {
        this.api.clearCredentials();
      }
    }
    this.router.navigate(["/", "login"]);
    return false;
  }
  
}
