import axios from "axios";

export const getToken = async () => {
  const result = await axios.get("/api/getToken");
  console.log({ result });
  
  return result.data;
};
