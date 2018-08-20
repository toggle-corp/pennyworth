import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


export default () => {
    const config = {
        apiKey: 'AIzaSyCIhaUinUGIlWhHcA5DIqHFAo4eqxVWkjc',
        authDomain: 'pennyworth-3aeb5.firebaseapp.com',
        databaseURL: 'https://pennyworth-3aeb5.firebaseio.com',
        projectId: 'pennyworth-3aeb5',
        storageBucket: 'pennyworth-3aeb5.appspot.com',
        messagingSenderId: '188831498454',
    };
    firebase.initializeApp(config);
};
