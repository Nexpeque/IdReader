import Firebase from 'firebase';

let config = {
    apiKey: 'AIzaSyA7m2aT8yMaYl459B_KcxQoFd1X0_4MWD4',
    authDomain: 'semanaingenieria-fe7f5.firebaseapp.com',
    databaseURL: 'https://semanaingenieria-fe7f5.firebaseio.com',
    projectId: 'semanaingenieria-fe7f5',
    storageBucket: '',
    messagingSenderId: '204423033191',
    appId: '1:204423033191:web:64c1195a3c7d8972cfffc2'
};

let app = Firebase.initializeApp(config);
export const db = app.database();