import axios from "axios";

const API_URL = `https://vlasovgenpass.herokuapp.com/api/savedpasswords/`;

// Create new password
const createPassword = async (passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, passwordData, config);

  return response.data;
};

//Update password
const updatePassword = async (id, passwordData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(API_URL + id, passwordData, config);
  return response.data;
};

//Get all passwords
const getPasswords = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);

  return response.data;
};

// Delete password
const deletePassword = async (passwordId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + passwordId, config);

  return response.data;
};

const passwordService = {
  getPasswords,
  deletePassword,
  createPassword,
  updatePassword,
};

export default passwordService;
