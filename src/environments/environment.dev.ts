export const environment = {
  appName: 'EPICSBot',
  isTest: false,
  nameSystem: 'EPICSBot',
  authAngular:{
    username:'s_epicsbot',
    password:'Gracia1234'
  },
  urlApiMicroservices: {
    domain: 'http://localhost:1010',
  },
  msal: {
    clientId: '96c0ad70-1305-41de-9dea-3acfc73b6d87',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: 'http://localhost:4200/login'
  },
  apiConnectId: '',
  urlApiIp: 'https://api.ipify.org/?format=json',
  passwordDefault: 'Epicsbot1234@',
  version:'v1.0.0'
};
