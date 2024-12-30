import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { EditTimeEntryComponent } from './dialogs/edit-time-entry/edit-time-entry.component';
import { TimeEntryConfirmDeleteComponent } from './dialogs/time-entry-confirm-delete/time-entry-confirm-delete.component';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavBarComponent,
    EditTimeEntryComponent,
    TimeEntryConfirmDeleteComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    //https://github.com/FortAwesome/angular-fontawesome/blob/master/docs/usage/icon-library.md#using-the-icon-library
    library.addIconPacks(fas, far);
  }}
