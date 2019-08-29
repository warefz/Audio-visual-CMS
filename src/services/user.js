module.exports = {
    getList(params) {
        return axios.post('/userInfo/getList',params).then((resp)=>{
            return resp.data;
        })
    },
    getUserById(params) {
        return axios.post('/userInfo/getUserById',params).then((resp)=>{
            return resp.data;
        })
    },
}