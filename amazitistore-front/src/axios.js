import axios from 'axios';

const instance = axios.create({
    // baseURL:'http://127.0.0.1:5001/amastore-704cc/us-central1/api'
    baseURL:'https://amazitit-b-store.onrender.com/'
})

export default instance