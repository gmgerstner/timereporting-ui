import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimeEntry } from '../../models/TimeEntry';
import { TimeReportingApiService } from '../../services/time-reporting-api.service';

@Component({
  selector: 'app-time-entry-confirm-delete',
  templateUrl: './time-entry-confirm-delete.component.html',
  styleUrls: ['./time-entry-confirm-delete.component.css']
})
export class TimeEntryConfirmDeleteComponent implements OnInit {

  @Input() timeEntryId: number = 0;
  public timeEntry: TimeEntry = new TimeEntry();
  @Output() deleteItem = new EventEmitter<number>();

  constructor(
    private api: TimeReportingApiService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  onConfirmDeleteTimeEntry(content : any) {
    this.api.getTimeEntry(this.timeEntryId).subscribe(te => {
      this.timeEntry = te;
      this.modalService.open(content).result
        .then((result) => {
          this.deleteItem.emit(this.timeEntryId);
        }, (reason) => {
          console.log(`Dismissed edit time entry dialog.`);
        });
    });
  }

}
