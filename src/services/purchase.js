module.exports = {
    getSoldListByType(params) {
        return axios.post("/purchase/cmsGetSoldListByType",params).then((resp) => {
            return resp.data;
        });
    },
    getSoldList(params) {
        return axios.post("/purchase/cmsGetSoldList",params).then((resp) => {
            return resp.data;
        });
    },
    getSellInfo(params) {
        return axios.post("/purchase/cmsGetSellInfo",params).then((resp) => {
            return resp.data;
        });
    },
}