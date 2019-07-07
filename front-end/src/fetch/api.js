import axios from "axios";
import { Toast } from "antd-mobile";

// 拦截请求
axios.interceptors.request.use(function(config) {
    Toast.loading("加载中", 0);
    return config;
});

// 拦截响应
axios.interceptors.response.use(function(config) {
    Toast.hide();
    return config;
});

function doGet(url, params) {
    return axios.get(url, { params });
}

function doPost(url, params) {
    console.log("params", params);
    return axios.post(url, params);
}

export default {
    // 登录
    login({ username, pwd }) {
        console.log({ username, pwd });
        return doPost("/user/login", { username, pwd });
    },

    // 注册
    register({ username, pwd, type }) {
        return doPost("/user/register", { username, pwd, type });
    },

    // 获取个人状态（是否登录）
    getUserInfo() {
        return doGet("/user/info");
    },

    // 更新个人信息
    updateUserInfo(data) {
        return doPost("/user/update", data);
    },

    // 获取对方列表
    getUserList(type) {
        return doGet("/user/list", { type });
    },

    // 退出
    logout() {
        return doPost("/user/logout");
    },

    // 获取个人聊天消息
    getMsgList() {
        return doGet("/user/msglist");
    },

    // 更新消息读取状态
    updateUnRead(front) {
        return doPost("/user/updateUnRead", { front });
    }
};