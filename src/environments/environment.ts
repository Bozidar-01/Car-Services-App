// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  baseLink: 'https://new-api.tippito.com',
  apiLink: 'https://new-api.tippito.com/api',
  production: false,
  carServiceStorageKey: {
    device_id: 'device_id',
    user: 'CarServicesUser',
    userLogin: 'userLogin',
    token: 'CarServicesToken',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
