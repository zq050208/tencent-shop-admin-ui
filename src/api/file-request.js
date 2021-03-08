import { Message } from 'element-ui';
import cookies from "js-cookie";
import router from "../router.js";

// 因为有图片，需要做成form-data格式的

const fileRequest = async (url, { data, method = 'POST' }) => {
  try {
    let defaultParams = {...data}
    const token = cookies.get('accessToken')
    console.log('token:',token)
    // if (!token) {
    //   router.push("/login");
    //   return;
    // }
    const res = await fetch(url, { credentials: 'include', method,  ...defaultParams,  headers: { 'content-type': 'multipart/form-data','accessToken': token } });
    let data = await res.json();
    if (data && data.respCode && data.respCode === '40001') {
      Message({
        message: data.respMsg || "登录过期，请重新登录",
        type: 'error',
        duration: 2 * 1000
      })
      // router.push("/login");
      return;
    }
    return data;
  } catch (err) {

  }
}

export default fileRequest;
