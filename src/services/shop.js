module.exports = {
    getInfoList(params) {
        return axios.post("/shop/getInfoList",params).then((resp) => {
            return resp.data;
        });
    },
    getInfo(params) {
        return axios.post("/shop/cmsGetInfo",params).then((resp) => {
            return resp.data;
        });
    },
    shopDetail(params) {
        return axios.post("/shop/shopDetail",params).then((resp) => {
            return resp.data;
        });
    },
    setChecked(params) {
        return axios.post('/shop/cmsSetChecked',params).then((resp)=>{
            return resp.data;
        })
    },
    delById(params) {
        return axios.post('/shop/delById',params).then((resp)=>{
            return resp.data;
        })
    },
}