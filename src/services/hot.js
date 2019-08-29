module.exports = {
    getList(params) {
        return axios.post("/hot/getList",params).then((resp) => {
            return resp.data;
        });
    },
    setSelected(params) {
        return axios.post("/hot/setSelected",params).then((resp) => {
            return resp.data;
        });
    },
    cancelSelected(params) {
        return axios.post("/hot/cancelSelected",params).then((resp) => {
            return resp.data;
        });
    },
    changeSeq(params) {
        return axios.post("/hot/changeSeq",params).then((resp) => {
            return resp.data;
        });
    },
}