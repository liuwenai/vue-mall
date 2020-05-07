import axios from '@/plugin/axios'
const prefix = "";



export const authorlist = () => {
    return axios.get(`${prefix}author/index`);
};

export const authorupdate = params => {
    return axios.post(`${prefix}author/update`, params)
}


export const authordelete = params => {
    return axios.post(`${prefix}author/delete/${params.id}`)
}

export const authorsave = params => {
    return axios.post(`${prefix}author/save`, params)
}

