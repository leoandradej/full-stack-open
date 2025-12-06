import axios from "axios";

const BASE_URL = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(BASE_URL);
  return request.then((response) => response.data);
};

const createContact = (newContact) => {
  const request = axios.post(BASE_URL, newContact);
  return request.then((response) => response.data);
};

const updateContact = (id, newContact) => {
  const request = axios.put(`${BASE_URL}/${id}`, newContact);
  return request.then((response) => response.data);
};

const deleteContact = (id) => {
  return axios.delete(`${BASE_URL}/${id}`);
};

export default { getAll, createContact, updateContact, deleteContact };
