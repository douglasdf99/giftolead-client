import axios from 'axios'
//const domain = "http://127.0.0.1:8000";
const domain = "https://api.saveleads.com.br";
const token = localStorage.getItem("accessToken")|| null;

export default axios.create({
  baseURL: domain,
  headers: { Authorization: `Bearer ${token}` }

})

