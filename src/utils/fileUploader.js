const uploadUrl = '/upload/upload/';

export default {
    normal(file) {
        let formData = new FormData();
        formData.append('file', file);
        return axios.post(uploadUrl, formData, {
            headers: {
                'Content-type': 'multipart/form-data'
            },
            withCredentials: true
        }).then((resp) => {
            return resp.data.data;
        })
    }
}