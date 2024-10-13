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
    clientId: '99d5446a-dce4-43ae-b25f-c5074e996d4d',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: 'http://localhost:4200/login'
  },
  apiConnectId: '',
  urlApiIp: 'https://api.ipify.org/?format=json',
  passwordDefault: 'Epicsbot1234@',
  version:'v1.0.0'
};
