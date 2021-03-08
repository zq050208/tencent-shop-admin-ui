import axios from "axios";
import router from "../router.js";
import { Message } from 'element-ui';
import cookies from 'js-cookie'
// const baseUrl = process.env.NODE_ENV === 'development' ? "http://192.168.50.10:8081/wwhl/" : "http://iot.juzi1688.cn/wwhl/";
axios.defaults.timeout = 150000; //设置接口超时时间
// axios.defaults.baseURL = baseUrl; //根据环境设置基础路径
axios.defaults.headers.post["Content-Type"] = "application/json"; //设置编码
/*
 *请求前拦截
 *用于处理需要请求前的操作
 */
axios.interceptors.request.use(
    config => {
      const isFirstLogin = localStorage.getItem('isFirstLogin');
      const reg = /#(\S*)/;
      const pathname = window.location.href.match(reg)[1];
      // 首次登录一定要修改密码，强制到登录界面去改密码
      if (isFirstLogin && isFirstLogin === '1' && pathname !== '/login') {
        Message({
          message: "首次登录一定要修改密码！",
          type: 'error',
          duration: 2 * 1000
        })
        router.push("/login");
      }
        let token = cookies.get('accessToken')
        const redirect = '/login?redirect=' + pathname;
        // if(!token && pathname !== '/login'){
        //   router.push(redirect);
        // }
        if (token) {
            config.headers["accessToken"] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(res => {
    const response = res.data
  if (response.respCode === '40001') {
    localStorage.clear();
    cookies.set('accessToken', '' );
    // router.push("/login");
    Message({
      message: response.respMsg || "服务器内部错误",
      type: 'error',
      duration: 2 * 1000
    })
    return
  }
    if(response.respCode === "00000"){
        return Promise.resolve(response)
    } else {
        Message({
            message: response.respMsg || "服务器内部错误",
            type: 'error',
            duration: 2 * 1000
        })
    }
}, error => {
    Message({
        message: '网络异常',
        type: 'error',
        duration: 2 * 1000
    })
    return Promise.reject(error)
})


/*
 *get方法，对应get请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function get(url, params) {

    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params
            })
            .then(res => {
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}
/*
 *post方法，对应post请求
 *@param {String} url [请求的url地址]
 *@param {Object} params [请求时候携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, params)
            .then(res => {
                // console.log(res)
                resolve(res);
            })
            .catch(err => {
                reject(err);
            });
    });
}
