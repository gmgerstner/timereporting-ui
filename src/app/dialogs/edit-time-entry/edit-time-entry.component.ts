import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimeEntry } from '../../models/TimeEntry';
import { TimeReportingApiService } from '../../services/time-reporting-api.service';

@Component({
  selector: 'app-edit-time-entry',
  templateUrl: './edit-time-entry.component.html',
  styleUrls: ['./edit-time-entry.component.css']
})
export class EditTimeEntryComponent implements OnInit {

  //see https://angular.io/guide/inputs-outputs
  @Input() timeEntryId: number = 0;
  @Output() editItem = new EventEmitter<TimeEntry>();
  public timeEntry: TimeEntry = new TimeEntry();
  public commonTitles: string[] = [];

  currentStartHour: string = "";
  currentStartMinute: string = "";
  currentStartTT: string = "";

  currentEndHasValue: boolean = false;
  currentEndHour: string = "";
  currentEndMinute: string = "";
  currentEndTT: string = "";

  public recentTitles: string[] = [];

  constructor(
    private api: TimeReportingApiService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.refreshCommonTitles();
    this.refreshRecentTitles();
  }

  refreshRecentTitles() {
    this.api.getRecentTitles().subscribe(list => this.recentTitles = list);
  }

  onTimeEntrySelect(title: string) {
    this.timeEntry.title = title;
  }

  refreshCommonTitles() {
    this.api.getCommonTitles().subscribe(list => this.commonTitles = list);
  }

 onEditTimeEntryClick(content : any) {
    this.api.getTimeEntry(this.timeEntryId).subscribe(te => {
      this.timeEntry = te;
      let dt0 = new Date(this.timeEntry.startTime);
      let dt1: Date | null = null;
      this.displayStartTime(dt0);
      if (te.endTime != null) {
        dt1 = new Date(te.endTime);
      }
      this.displayEndTime(dt1);
      this.modalService.open(content).result
        .then((result) => {
          this.collectTimeEntry();
          this.api.editTimeEntry(this.timeEntry).subscribe(() => {
            this.editItem.emit(this.timeEntry);
          });
        }, (reason) => {
          console.log(`Dismissed edit time entry dialog.`);
        });
    });
  }

  getDisplayedStartTime(): Date {
    let dt = new Date();

    let yyyy = dt.getFullYear();
    let MM = 1 + dt.getMonth();
    let dd = dt.getDate();
    let hh = parseInt(this.currentStartHour);
    let mm = this.currentStartMinute;

    if (this.currentStartTT == "PM" && hh < 12) hh += 12;
    if (this.currentEndTT == "AM" && hh == 12) hh = 0;

    let text = `${yyyy}-${MM.toString().padStart(2, '0')}-${dd.toString().padStart(2, '0')}T${hh.toString().padStart(2, '0')}:${mm.padStart(2, '0')}:00.000`;
    dt = new Date(text);
    return dt;
  }

  getDisplayedEndTime(): Date {
    let dt = new Date();

    let yyyy = dt.getFullYear();
    let MM = 1 + dt.getMonth();
    let dd = dt.getDate();
    let hh = parseInt(this.currentEndHour);
    let mm = this.currentEndMinute;

    if (this.currentEndTT == "PM" && hh < 12) hh += 12;
    if (this.currentEndTT == "AM" && hh == 12) hh = 0;

    let text = `${yyyy}-${MM.toString().padStart(2, '0')}-${dd.toString().padStart(2, '0')}T${hh.toString().padStart(2, '0')}:${mm.padStart(2, '0')}:00.000`;
    dt = new Date(text);
    return dt;
  }

  collectTimeEntry(): void {
    this.timeEntry.startTime = this.api.toLocalISODateTimeString(this.getDisplayedStartTime());
    if (this.currentEndHasValue) {
      this.timeEntry.endTime = this.api.toLocalISODateTimeString(this.getDisplayedEndTime());
    }
    else {
      this.timeEntry.endTime = null;
    }
  }

  roundToNearestQuarter(minutes: number): number {
    let quarter = minutes / 15;
    quarter = Math.round(quarter);
    let newminutes = quarter * 15;
    return newminutes;
  }

  displayStartTime(dt: Date) {
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
      if (hr >= 12 && tt == "PM") tt = "AM";
      if (hr > 12) hr -= 12;
    }
    this.currentStartHour = hr.toString().padStart(2, '0');//https://www.javascripttutorial.net/es-next/pad-string/
    if (this.currentStartHour == "00") this.currentStartHour = "12";
    this.currentStartMinute = nearestMin.toString().padStart(2, '0');
    this.currentStartTT = tt;
  }

  displayEndTime(dt: Date | null) {
    this.currentEndHasValue = (dt != null);

    if (dt == null) {
      dt = new Date();
    }


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
      if (hr >= 12 && tt == "PM") tt = "AM";
      if (hr > 12) hr -= 12;
    }
    this.currentEndHour = hr.toString().padStart(2, '0');//https://www.javascripttutorial.net/es-next/pad-string/
    if (this.currentEndHour == "00") this.currentEndHour = "12";
    this.currentEndMinute = nearestMin.toString().padStart(2, '0');
    this.currentEndTT = tt;
  }

  onStartNowClicked() {
    let dt = new Date();
    this.displayStartTime(dt);
  }

  onEndNowClicked() {
    let dt = new Date();
    this.displayEndTime(dt);
  }

  onStartShiftMinutesClicked(duration: number) {
    let hr = parseInt(this.currentStartHour);
    let min = parseInt(this.currentStartMinute) + duration;
    let tt = this.currentStartTT;
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

    this.currentStartHour = hr.toString().padStart(2, '0');//https://www.javascripttutorial.net/es-next/pad-string/
    if (this.currentStartHour == "00") this.currentStartHour = "12";
    this.currentStartMinute = min.toString().padStart(2, '0');
    this.currentStartTT = tt;
  }

  onEndShiftMinutesClicked(duration: number) {
    let hr = parseInt(this.currentEndHour);
    let min = parseInt(this.currentEndMinute) + duration;
    let tt = this.currentEndTT;
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

    this.currentEndHour = hr.toString().padStart(2, '0');//https://www.javascripttutorial.net/es-next/pad-string/
    if (this.currentEndHour == "00") this.currentEndHour = "12";
    this.currentEndMinute = min.toString().padStart(2, '0');
    this.currentEndTT = tt;
  }
}
