import axios from 'axios'

const request = axios.create({
  baseURL: process.env.VUE_APP_SERVER
})


request.interceptors.request.use(config => {
  return config
})

request.interceptors.response.use(res => {
  return res.data && res.data.data || res.data.error
})

const _mixinAxios = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://api.mixin.one' : 'https://mixin-api.zeromesh.net',
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  retry: 2
})

export default {
  request,
  async getBtcPrice() {
    let { data } = await _mixinAxios.get('/network/assets/search/btc')
    return data.data[0].price_usd
  },
  async checkPaid(params) {
    let { data } = await _mixinAxios.post('/payments', params)
    return data.data
  },
  async getFiats() {
    return await request.get('/getFiats')
  },
  async getDonate(id) {
    let params = { id, code: window.localStorage.getItem(id) }
    let t = await request.post('/getDonate', params)
    if (!t || !t.date) return false
    window.localStorage.setItem(id, t.date)
    return t
  },
  async authenticate(code) {
    let file = window.sessionStorage.getItem('file')
    let amount = window.sessionStorage.getItem('amount')
    let currency = window.sessionStorage.getItem('currency')
    amount = JSON.parse(amount)
    return await request.post('authenticate', { code, file, amount, currency })
  }
}