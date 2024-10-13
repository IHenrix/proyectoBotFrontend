export const environment = {
  appName: 'EPICSBot',
  isTest: false,
  nameSystem: 'EPICSBot',
  authAngular:{
    username:'s_epicsbot',
    password:'Gracia1234'
  },
  urlApiMicroservices: {
    domain: 'https://epicsbot-app-service.rj.r.appspot.com',
  },
  msal: {
    clientId: '99d5446a-dce4-43ae-b25f-c5074e996d4d',//'96c0ad70-1305-41de-9dea-3acfc73b6d87',
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: 'https://epicsbot-app-85957209609.southamerica-east1.run.app/login',
  },
  apiConnectId: '',
  urlApiIp: 'https://api.ipify.org/?format=json',
  passwordDefault: 'Epicsbot1234@',
  version:'v1.0.0'
};
