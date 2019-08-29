// const LOGIN = 'console/admin/login'
const LOGIN = '/admin/cmsLogin'

module.exports = {
    login(params) {
        return axios.post(LOGIN,params)
        .then((resp) => {
            return resp.data;
        });
    },
    editPassword(params) {
        return axios.post('/admin/cmsEditPassword',params)
        .then((resp) => {
            return resp.data;
        });
    },
    isLogin(params) {
        return axios.post('/admin/cmsIsLogin',params)
        .then((resp) => {
            return resp.data;
        });
    },
    logout(params) {
        return axios.post('/admin/cmsLogout',params)
        .then((resp) => {
            return resp.data;
        });
    },
    
}