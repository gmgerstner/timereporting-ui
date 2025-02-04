# Time Reporting User Interface

The Time Reporting User Interface is for recording time spent on individual tasks for use with any timesheet system. This code is the client side (UI) logic.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.

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
- Make sure the Application Pool's .NET CLR Version is set to No Managed Code
- Open the package.json file and update the folder paths for copy and deploy to the physical path for the UI code.
- Open the environment.prod.ts file and adjust the url to point to the correct api path.
- In a command prompt (or powershell) run:
  ```
  npm install
  npm run deploy
  ```
- Install the API (see https://github.com/gmgerstner/timereporting-api)
