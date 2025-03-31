export const environment = {
  baseLink: 'https://car-services.uniscenevie.com',
  apiLink: 'https://car-services.uniscenevie.com/api',
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