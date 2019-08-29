module.exports = {
    getList(params) {
        return axios.post("/attribute/getList",params)
        .then((resp) => {
            return resp.data;
        });
    },
    edit(params) {
        return axios.post("/attribute/edit",params)
        .then((resp) => {
            return resp.data;
        });
    },
    isUsed(params) {
        return axios.post("/attribute/isUsed",params)
        .then((resp) => {
            return resp.data;
        });
    },
    delAttribute(params) {
        return axios.post("/attribute/delInfo",params)
        .then((resp) => {
            return resp.data;
        });
    },
    changeSeq(params) {
        return axios.post("/attribute/changeSeq",params)
        .then((resp) => {
            return resp.data;
        });
    },
}