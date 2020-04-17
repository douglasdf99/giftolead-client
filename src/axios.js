import axios from 'axios'
//const domain = "https://api.saveleads.com.br";
const domain = "http://127.0.0.1:8000";
export default axios.create({
  baseURL: domain,
  // You can add your headers here
})

