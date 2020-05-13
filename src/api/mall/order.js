import axios from '@/plugin/axios'
const prefix = "";



export const morderlist = () => {
    return axios.get(`${prefix}morder/all`);
};

export const morderupdate = params => {
    return axios.post(`${prefix}morder/update`, params)
}


export const morderdelete = params => {
    return axios.post(`${prefix}morder/delete/${params.id}`)
}

export const mordersave = params => {
    return axios.post(`${prefix}morder/save`, params)
}

