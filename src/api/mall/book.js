import axios from '@/plugin/axios'
const prefix = "";



export const booklist = () => {
    return axios.get(`${prefix}book/index`);
};

export const bookupdate = params => {
    return axios.put(`${prefix}book/update`, params)
}


export const bookdelete = params => {
    return axios.post(`${prefix}book/delete/${params.id}`)
}

export const booksave = params => {
    return axios.get(`${prefix}book/save/`, params)
}

