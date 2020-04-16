import axios from 'axios'
const domain = "https://api.saveleads.com.br";
export default axios.create({
  baseURL: domain,
  // You can add your headers here
})

