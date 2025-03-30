export const environment = {
  baseLink: 'https://new-api.tippito.com',
  apiLink: 'https://new-api.tippito.com/api',
  production: true,
  carServiceStorageKey: {
    device_id: 'device_id',
    user: 'CarServicesUser',
    userLogin: 'userLogin',
    token: 'CarServicesToken',
  },

  regexes: {
    email:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  }

};
