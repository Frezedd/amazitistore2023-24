import axios from 'axios';

const instance = axios.create({
    baseURL:'https://amazitit-b-store.onrender.com/'
})

export default instance