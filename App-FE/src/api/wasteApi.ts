import axiosInstance from "../lib/axios";

export const getMyWasteListings = async () => {
  try {
    const response = await axiosInstance.get("/waste");
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to fetch listings" };
  }
};


export const createWasteListing = async (data: any) => {
  try {
    const response = await axiosInstance.post("/waste", data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Failed to create listing" };
  }
};

export const updateWasteListing = async (id: string, data: any) => {
  const response = await axiosInstance.put(`/waste/${id}`, data);
  return response.data;
};