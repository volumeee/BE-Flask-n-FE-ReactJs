import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = (): { headers: { Authorization?: string } } => {
  const token = localStorage.getItem("googleToken");
  if (token) {
    return { headers: { Authorization: `Bearer ${token}` } };
  } else {
    console.error("No token found, user might not be logged in.");
    return { headers: {} };
  }
};

export interface Member {
  id: string;
  name: string;
  position: string;
  reports_to?: string;
}

export const getMembers = async (): Promise<AxiosResponse<Member[]>> => {
  try {
    return await axios.get<Member[]>(`${API_URL}/members`, getAuthHeader());
  } catch (error) {
    console.error("Failed to fetch members", error);
    throw error;
  }
};

export const getMemberById = async (
  memberId: string
): Promise<AxiosResponse<Member>> => {
  try {
    return await axios.get<Member>(
      `${API_URL}/members/${memberId}`,
      getAuthHeader()
    );
  } catch (error) {
    console.error(`Failed to fetch member with ID ${memberId}`, error);
    throw error;
  }
};

export const createMember = async (
  data: FormData
): Promise<AxiosResponse<{ id: string }>> => {
  try {
    return await axios.post(`${API_URL}/members`, data, getAuthHeader());
  } catch (error) {
    console.error("Failed to create member", error);
    throw error;
  }
};

export const updateMember = async (
  memberId: string,
  data: FormData
): Promise<AxiosResponse<Member>> => {
  try {
    return await axios.put(
      `${API_URL}/members/${memberId}`,
      data,
      getAuthHeader()
    );
  } catch (error) {
    console.error(`Failed to update member with ID ${memberId}`, error);
    throw error;
  }
};

export const deleteMember = async (
  memberId: string
): Promise<AxiosResponse<{ message: string }>> => {
  try {
    return await axios.delete(
      `${API_URL}/members/${memberId}`,
      getAuthHeader()
    );
  } catch (error) {
    console.error(`Failed to delete member with ID ${memberId}`, error);
    throw error;
  }
};
