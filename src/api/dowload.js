import { Message } from 'element-ui';
import cookies from "js-cookie";
import router from "../router.js";

// fetch下载文件
const downloadData = async (url, { data, method = 'POST' } ) => {
  try {

    let defaultParams = {}
    if (data) {
      if (method === 'POST') {
        defaultParams = {body: JSON.stringify(data)}
      } else {
        // 拼接参数
        // url = url.endsWith('?')
        //   ? url + queryString.stringify(data)
        //   : `${url}?${queryString.stringify(data)}`;
      }
    }
    const token = cookies.get('accessToken')
    const res = await fetch(url, { credentials: 'include', method,  ...defaultParams,  headers: { 'content-type': 'application/json','accessToken': token } });
    // 存在文件流走下载方法
    if (res.headers.get('Content-Disposition')) {
      const blob = await res.blob();
      let disposition = res.headers.get('Content-Disposition')
      let downloadFileNameMsg = [Date.now(), 'xls']
      try {
        downloadFileNameMsg = disposition ?  disposition.split('filename=')[1].split('.') : [Date.now(), 'xls']
      } catch (e) {
        downloadFileNameMsg = [Date.now(), 'xls']
      }
      const filename = `${decodeURI(downloadFileNameMsg[0])}.${downloadFileNameMsg[1]}`;
      // 兼容旧版本
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        const a = document.createElement('a');
        // 兼容火狐，将a标签添加到body当中
        document.body.appendChild(a);
        // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
        const downloadUrl = window.URL.createObjectURL(blob);
        a.href = downloadUrl;
        a.download = filename;
        a.target = '_blank';
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
      }
      Message({
        message: '导出成功',
        type: 'success',
        duration: 2 * 1000
      })
    } else {
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
      if (!data) {
        return Message({
          message: '导出失败，请稍后再试',
          type: 'error',
        })
      }
      return data;
    }

  } catch (err) {
    Message({
      message: err.msg ||'网络异常',
      type: 'error',
      duration: 3 * 1000
    })
    throw err;
  }
};

export default downloadData
