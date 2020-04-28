import axios from '@/plugin/axios'
const prefix = "";



export const userlist = () => {
    return axios.get(`${prefix}user/index`);
};

export const usershow = () => {
    return axios.get(`${prefix}user/show/${params.id}`);
};

export const userupdate = params => {
    return axios.put(`${prefix}user/update`, params)
}


export const userdelete = params => {
    return axios.post(`${prefix}user/delete/${params.id}`)
}

export const usersave = params => {
    return axios.get(`${prefix}user/save/`, params)
}

