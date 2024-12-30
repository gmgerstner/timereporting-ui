import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginCredentials } from '../models/LoginCredentials';
import { User } from '../models/User';
import { TimeEntry } from '../models/TimeEntry';
import { TimeSheetEntry } from '../models/TimeSheetEntry';

@Injectable({
  providedIn: 'root'
})
export class TimeReportingApiService {

  public static rememberLoginKey: string = "RememberLogin";
  public static usernameKey: string = "Username";
  public static passwordKey: string = "Password";
  public static tokenKey: string = "Token";
  public static expiresKey: string = "Expires";

  constructor(private http: HttpClient) { }

  loggedIn(): boolean {
    let username = localStorage.getItem("Username");
    let value = username != null;
    return value;
  }

  setCredentials(user: User) {
    localStorage.setItem(TimeReportingApiService.usernameKey, user.username);
    localStorage.setItem(TimeReportingApiService.tokenKey, user.token);
    localStorage.setItem(TimeReportingApiService.expiresKey, user.expires);
  }

  clearCredentials() {
    localStorage.setItem(TimeReportingApiService.tokenKey, "");
    localStorage.setItem(TimeReportingApiService.expiresKey, "");
  }

  renewToken(): Observable<User> {
    let url = `${environment.ApiUrl}/Authentication/Renew`;
    let headers = this.generateHeaders();
    return this.http.post<User>(url, null, { headers: headers });
  }

  generateHeaders(): HttpHeaders {
    let token = localStorage.getItem(TimeReportingApiService.tokenKey);
    let headers = new HttpHeaders({
      //'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }

  login(credentials: LoginCredentials): Observable<User> {
    let url = `${environment.ApiUrl}/Authentication/Login`;
    return this.http.post<User>(url, credentials);
  }

  getRecentTitles(): Observable<string[]> {
    let url = `${environment.ApiUrl}/TimeEntries/GetRecentTitles`;
    let headers = this.generateHeaders();
    return this.http.get<string[]>(url, { headers: headers });
  }

  getCommonTitles(): Observable<string[]> {
    let url = `${environment.ApiUrl}/TimeEntries/GetCommonTitles`;
    let headers = this.generateHeaders();
    return this.http.get<string[]>(url, { headers: headers });
  }

  refreshSchedule(): Observable<TimeEntry[]> {
    let url = `${environment.ApiUrl}/TimeEntries/GetSchedule`;
    let headers = this.generateHeaders();
    return this.http.get<TimeEntry[]>(url, { headers: headers });
  }

  refreshTimeSheet(workdate: string): Observable<TimeSheetEntry[]> {
    let url = `${environment.ApiUrl}/TimeEntries/GetDailyTimeSheet`;
    if (workdate != null) {
      url += "?WorkDate=" + workdate;
    }
    let headers = this.generateHeaders();
    return this.http.get<TimeSheetEntry[]>(url, { headers: headers });
  }

  startClock(title: string, time: Date): Observable<number> {
    let dt = this.toLocalISODateTimeString(time);
    let url = `${environment.ApiUrl}/TimeEntries/StartClock?Title=${title}&Time=${dt}`;
    let headers = this.generateHeaders();
    return this.http.post<number>(url, null, { headers: headers });
  }

  stopClock(time: Date): Observable<void> {
    let dt = this.toLocalISODateTimeString(time);
    let url = `${environment.ApiUrl}/TimeEntries/StopClock?Time=${dt}`;
    let headers = this.generateHeaders();
    return this.http.post<void>(url, null, { headers: headers });
  }

  getTimeEntry(id: number): Observable<TimeEntry> {
    let url = `${environment.ApiUrl}/TimeEntries/GetTimeEntry?id=${id}`;
    let headers = this.generateHeaders();
    return this.http.get<TimeEntry>(url, { headers: headers });
  }

  editTimeEntry(timeEntry: TimeEntry): Observable<TimeEntry> {
    let url = `${environment.ApiUrl}/TimeEntries/EditTimeEntry?id=${timeEntry.timeEntryId}&Title=${timeEntry.title}&StartTime=${timeEntry.startTime}`;
    if (timeEntry.endTime != null) {
      url += `&EndTime=${timeEntry.endTime}`;
    }
    let headers = this.generateHeaders();
    return this.http.post<TimeEntry>(url, null, { headers: headers });
  }

  deleteTimeEntry(id: number): Observable<void> {
    let url = `${environment.ApiUrl}/TimeEntries/DeleteTimeEntry?id=${id}`;
    let headers = this.generateHeaders();
    return this.http.delete<void>(url, { headers: headers });
  }

  toLocalISODateTimeString(dt: Date): string {
    let yyyy = dt.getFullYear();
    let MM = 1 + dt.getMonth();
    let dd = dt.getDate();
    let hh = dt.getHours();
    let mm = dt.getMinutes();

    let text = `${yyyy}-${MM.toString().padStart(2, '0')}-${dd.toString().padStart(2, '0')}T${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:00.000`;
    return text;
  }

  toLocalISODateString(dt: Date): string {
    let yyyy = dt.getFullYear();
    let MM = 1 + dt.getMonth();
    let dd = dt.getDate();

    let text = `${yyyy}-${MM.toString().padStart(2, '0')}-${dd.toString().padStart(2, '0')}`;
    return text;
  }
}
