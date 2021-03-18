// 网络请求封装
import axios from "axios"

export function request(config) {
    // axios 封装基础配置
    const instance = axios.create({
        baseURL: "http://152.136.185.210:7878/api/m5",
        timeout: 5000
    })

    // 响应过滤器，过滤响应数据
    instance.interceptors.response.use(res => {
        return res.data;
    }, err => {
        console.log(err);
    })

    // 发送网络请求
    return instance(config)
}