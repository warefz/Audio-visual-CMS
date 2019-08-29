module.exports = {
    edit(params) {
        return axios.post("/tip/edit",params)
        .then((resp) => {
            return resp.data;
        });
    },
    delTip(params) {
        return axios.post("/tip/delTip",params)
        .then((resp) => {
            return resp.data;
        });
    },
    getRootList(params) {
        return axios.post("/tip/getRootTips",params)
        .then((resp) => {
            return resp.data;
        });
    },
    getList(params) {
        return axios.post("/tip/getList",params)
        .then((resp) => {
            return resp.data;
        });
    },
    getTip(params) {
        return axios.post("/tip/getTip",params)
        .then((resp) => {
            return resp.data;
        });
    },
    changeSeq(params) {
        return axios.post("/tip/changeSeq",params)
        .then((resp) => {
            return resp.data;
        });
    },
}