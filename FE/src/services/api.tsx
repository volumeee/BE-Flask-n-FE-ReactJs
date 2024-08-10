import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:5000/api";

const getAuthHeader = (): { headers: { Authorization?: string } } => {
  const token = localStorage.getItem("googleToken");
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : { headers: {} };
};

export interface Member {
  id: string;
  name: string;
  position: string;
  reports_to?: string;
  file_url?: string;
  skills?: {
    communication: number;
    leadership: number;
    problemSolving: number;
  };
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
  const skills = {
    communication: Number(data.get("communication")),
    leadership: Number(data.get("leadership")),
    problemSolving: Number(data.get("problemSolving")),
  };
  data.set("skills", JSON.stringify(skills));

  try {
    return await axios.put(`${API_URL}/members/${memberId}`, data, {
      ...getAuthHeader(),
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeader().headers,
      },
    });
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
