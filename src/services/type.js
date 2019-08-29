module.exports = {
    getRootType() {
        return axios.post("/type/cmsGetRootType")
        .then((resp) => {
            return resp.data;
        });
    },
    getRootList() {
        return axios.post("/type/getRootType")
        .then((resp) => {
            return resp.data;
        });
    },
    getType(params) {
        return axios.post("/type/getType",params)
        .then((resp) => {
            return resp.data;
        });
    },
    getTypes(params) {
        return axios.post("/type/getTypes",params)
        .then((resp) => {
            return resp.data;
        });
    },
    getTypesInfo(params) {
        return axios.post("/type/getTypesInfo",params)
        .then((resp) => {
            return resp.data;
        });
    },
    changeSeq(params) {
        return axios.post("/type/changeSeq",params)
        .then((resp) => {
            return resp.data;
        });
    },
    edit(params) {
        return axios.post("/type/edit",params)
        .then((resp) => {
            return resp.data;
        });
    },
    delType(params) {
        return axios.post("/type/delType",params)
        .then((resp) => {
            return resp.data;
        });
    },
}