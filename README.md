# Time Reporting User Interface

The Time Reporting User Interface is for recording time spent on individual tasks for use with any timesheet system. This code is the client side (UI) logic.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.


## Deploying to Server

```cmd
ng build --prod
npm run copy
```

## Initial Installation on Server

- Create a folder for the UI code.
- In IIS right-click Sites and select Add WebSite
- Enter the following:
  - Site Name
  - Physical path to the folder created above
  - Binding and Host name information as desired
