const axios = require('axios');

const getMembers = () => {
    return axios.get('http://localhost:8000/api/members');
}
const addMember = (member) => {
    return axios.post('http://localhost:8000/api/members', member);
}
const updateMember = (id, member) => {
    return axios.put('http://localhost:8000/api/members/' + id, member);
}
const deleteMember = (id) => {
    return axios.delete('http://localhost:8000/api/members/' + id);
}
module.exports = { getMembers, updateMember, deleteMember, addMember };
