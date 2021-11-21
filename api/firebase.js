import firebase from "firebase";
import { LogBox } from 'react-native';


const firebaseConfig = {
        apiKey: "AIzaSyDOGSeK6dzZG4R9WPzyrzX4rmwaEHSG8b0",
        authDomain: "mecanicaapp-62e88.firebaseapp.com",
        projectId: "mecanicaapp-62e88",
        storageBucket: "mecanicaapp-62e88.appspot.com",
        messagingSenderId: "788495199353",
        appId: "1:788495199353:web:1b9111698f72cba63e38a8"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  // LogBox.ignoreAllLogs();
  // console.disableYellowBox = true;
}

export default firebase;