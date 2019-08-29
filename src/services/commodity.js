module.exports = {
    getList(params) {
        return axios.post("/commodity/cmsGetList",params)
        .then((resp) => {
            return resp.data;
        });
    },
    cmsGetSelected(params) {
        return axios.post("/commodity/cmsGetSelected",params)
        .then((resp) => {
            return resp.data;
        });
    },
    getInfo(params) {
        return axios.post('/commodity/getInfo',params).then((resp)=>{
            return resp.data;
        })
    },
    setChecked(params) {
        return axios.post('/commodity/cmsSetChecked',params).then((resp)=>{
            return resp.data;
        })
    },
    delById(params) {
        return axios.post('/commodity/cmsDelById',params).then((resp)=>{
            return resp.data;
        })
    },
}