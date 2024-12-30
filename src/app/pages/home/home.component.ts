import { Component, OnInit } from '@angular/core';
import { TimeEntry } from '../../models/TimeEntry';
import { TimeSheetEntry } from '../../models/TimeSheetEntry';
import { TimeReportingApiService } from '../../services/time-reporting-api.service';
import { DateTime } from 'luxon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public currentTitle: string = "";
  public commonTitles: string[] = [];
  public recentTitles: string[] = [];
  public currentTimeEntries: TimeEntry[] = [];
  public currentTimeSheetEntries: TimeSheetEntry[] = [];
  public selectedHour: string = "";
  public selectedMinute: string = "";
  public selectedTT: string = "";
  public scheduleDate: string = this.api.toLocalISODateString(new Date());

  public timesheetPortalUrl: string = environment.timesheetPortalUrl;
  public timesheetPortalName: string = environment.timesheetPortalName;

  constructor(
    private api: TimeReportingApiService
  ) { }

  ngOnInit(): void {
    this.refreshCommonTitles();
    this.refreshRecentTitles();
    this.refreshSchedule();
    this.refreshTimeSheet();
    this.onNowClicked();
  }

  onScheduleDateChange(dt: string) {
    this.api.refreshTimeSheet(dt).subscribe(list => {
      this.currentTimeSheetEntries = list;
    });
  }

  onScheduleDateTodayClicked() {
    this.scheduleDate = this.api.toLocalISODateString(new Date());
    this.onScheduleDateChange(this.scheduleDate);
  }

  onScheduleDatePreviousClicked() {
    let dt: DateTime = DateTime.fromISO(this.scheduleDate);
    dt = dt.plus({ days: -1 });
    this.scheduleDate = dt.toISODate()
    this.onScheduleDateChange(this.scheduleDate);
  }

  onScheduleDateNextClicked() {
    let dt: DateTime = DateTime.fromISO(this.scheduleDate);
    dt = dt.plus({ days: +1 });
    this.scheduleDate = dt.toISODate()
    this.onScheduleDateChange(this.scheduleDate);
  }

  refreshCommonTitles() {
    this.api.getCommonTitles().subscribe(list => this.commonTitles = list);
  }

  refreshRecentTitles() {
    this.api.getRecentTitles().subscribe(list => this.recentTitles = list);
  }

  refreshSchedule() {
    this.api.refreshSchedule().subscribe(list => {
      if (list.length > 1) {
        for (let i = 0; i < list.length - 1; i++) {
          if (list[i].endTime == null) {
            list[i].endTime = list[i + 1].startTime;
          }
        }
      }
      this.currentTimeEntries = list;
    });
  }

  refreshTimeSheet() {
    let dt = this.scheduleDate;
    this.api.refreshTimeSheet(dt).subscribe(list => {
      this.currentTimeSheetEntries = list;
    });
  }

  formatTime(dt: string | null): string {
    if (dt == null) return "";

    let value = new Date(dt);
    let hr = value.getHours();
    let min = value.getMinutes();
    let tt = "AM";
    if (hr >= 12) tt = "PM";
    if (hr > 12) hr -= 12;

    let nearestMin = this.roundToNearestQuarter(min);
    if (nearestMin >= 60) {
      nearestMin -= 60;
      hr++;
      if (hr >= 12 && tt == "AM") tt = "PM";
      if (hr >= 12 && tt == "PM") tt = "AM";
      if (hr > 12) hr -= 12;
    }

    let currentHour = hr.toString().padStart(2, '0');//https://www.javascripttutorial.net/es-next/pad-string/
    if (currentHour == "00") currentHour = "12";
    let currentMinute = nearestMin.toString().padStart(2, '0');
    let currentTT = tt;

    let output = `${currentHour}:${currentMinute} ${currentTT}`;
    return output;
  }

  onTimeEntrySelect(title: string) {
    this.currentTitle = title;
  }

  onTimeEntryEdit(timeEntry: TimeEntry) {
    this.refreshRecentTitles();
    this.refreshSchedule();
    this.refreshTimeSheet();
  }

  onTimeEntryDelete(timeEntryId: number) {
    this.api.deleteTimeEntry(timeEntryId).subscribe(() => {
      this.refreshRecentTitles();
      this.refreshSchedule();
      this.refreshTimeSheet();
    });
  }

  onNowClicked() {
    let dt = new Date();
    this.displayTime(dt);
  }

  roundToNearestQuarter(minutes: number): number {
    let quarter = minutes / 15;
    quarter = Math.round(quarter);
    let newminutes = quarter * 15;
    return newminutes;
  }

  displayTime(dt: Date) {
    let hr = dt.getHours();
    let min = dt.getMinutes();
    let tt = "AM";
    if (hr >= 12) tt = "PM";
    if (hr > 12) hr -= 12;

    let nearestMin = this.roundToNearestQuarter(min);
    if (nearestMin >= 60) {
      nearestMin -= 60;
      hr++;
      if (hr >= 12 && tt == "AM") tt = "PM";
      else if (hr >= 12 && tt == "PM") tt = "AM";
      if (hr > 12) hr -= 12;
    }
    this.selectedHour = hr.toString().padStart(2, '0');//https://www.javascripttutorial.net/es-next/pad-string/
    this.selectedMinute = nearestMin.toString().padStart(2, '0');
    this.selectedTT = tt;
  }

  getDisplayedTime(): Date {
    let dt = new Date();

    let yyyy = dt.getFullYear();
    let MM = 1 + dt.getMonth();
    let dd = dt.getDate();
    let hh = parseInt(this.selectedHour);
    let mm = this.selectedMinute;

    if (this.selectedTT == "PM" && hh < 12) hh += 12;
    if (this.selectedTT == "AM" && hh == 12) hh = 0;

    let text = `${yyyy}-${MM.toString().padStart(2, '0')}-${dd.toString().padStart(2, '0')}T${hh.toString().padStart(2, '0')}:${mm.padStart(2, '0')}:00.000`;
    dt = new Date(text);
    return dt;
  }

  getTotalHours(): number {
    let hrs = 0;
    if (this.currentTimeSheetEntries != null && this.currentTimeSheetEntries.length > 0) {
      for (let i = 0; i < this.currentTimeSheetEntries.length; i++) {
        hrs += this.currentTimeSheetEntries[i].totalHours;
      }
    }
    return hrs;
  }

  onShiftMinutesClicked(duration: number) {
    let hr = parseInt(this.selectedHour);
    let min = parseInt(this.selectedMinute) + duration;
    let tt = this.selectedTT;
    if (tt == "AM" && hr == 12) hr = 0;
    if (tt == "PM" && hr != 12) hr += 12;

    if (min < 0) {
      min += 60;
      hr--;
      if (hr < 0) hr += 24;
    }
    if (min >= 60) {
      min -= 60;
      hr++;
      if (hr >= 24) hr -= 24;
    }

    if (hr >= 12) tt = "PM"; else { tt = "AM"; }
    if (hr > 12) hr -= 12;
    if (hr == 0 && tt == "AM") hr = 12;

    this.selectedHour = hr.toString().padStart(2, '0');//https://www.javascripttutorial.net/es-next/pad-string/
    this.selectedMinute = min.toString().padStart(2, '0');
    this.selectedTT = tt;
  }

  onStartClockClicked() {
    let title = this.currentTitle;
    if (title === undefined || title == "") {
      alert("No title selected.");
      return;
    }
    this.startClock(title, this.getDisplayedTime());
  }

  onStopClockClicked() {
    this.api.stopClock(this.getDisplayedTime()).subscribe(() => {
      this.refreshRecentTitles();
      this.refreshSchedule();
      this.refreshTimeSheet();
    });
  }

  onResumeTimeEntry(title: string) {
    let quartersize = 1000 * 3600 / 4;

    let dt = new Date();
    let dt2 = new Date(Math.round(dt.valueOf() / quartersize) * quartersize);

    this.startClock(title, dt2);
  }

  startClock(title: string, time: Date) {
    this.api.startClock(title, time).subscribe(id => {
      this.refreshRecentTitles();
      this.refreshSchedule();
      this.refreshTimeSheet();
    });
  }

  cleanTitle(title: string): string {
    let i = title.indexOf("|");
    title = title.substring(0, i).trim();
    return title;
  }
}
