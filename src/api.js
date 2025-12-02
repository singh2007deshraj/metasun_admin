import axios from "axios";
import { base_url } from "./config";

export const getToken = () => localStorage.getItem("metasunAdminToken");
export async function login(email, password) {
  try {
    const res = await axios.post(`${base_url}/Adminlogin`, {
      email,
      password,
    });
    if (res?.data?.status) {
        return res.data;
    }
  } catch (error) {
    return error?.response?.data;
  }
}

export async function getDashboardData(end_point) {
  try {
    const res = await axios.get(`${base_url}/${end_point}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    //console.log(res);
    if (res?.data && res?.data?.success) {
      return res?.data;
    }
  } catch (error) {
    return [];
  }
}

export async function getWithdrawal(end_point, ...pagination) {
  const { page, limit, status, fromTimeInUnix, toTimeInUnix, query } =
    pagination[0];
  // console.log(page, limit, status, pagination);
  try {
    const res = await axios.post(
      `${base_url}/admin/${end_point}`,
      { status, page, fromTimeInUnix, toTimeInUnix, query },
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    if (res?.data && res?.data?.success) {
      return res?.data;
    }
  } catch (error) {
    return [];
  }
}

export async function getDeposit(end_point, ...pagination) {
  const { page, limit, fromTime, toTime, query } =
    pagination[0];
   console.log(page, limit, fromTime, toTime, query);
  try {
    const res = await axios.get(
      `${base_url}/${end_point}`,
      { 
        headers: { Authorization: `Bearer ${getToken()}`}, 
        params: { page, limit, fromTime, toTime, query },
     });
   
    if (res?.data && res?.data?.success) {
      return res?.data;
    }
  } catch (error) {
    return [];
  }
}

export async function getUsers(end_point, ...pagination) {
  const { page, limit, query = ""} = pagination[0];
  //console.log({ page, limit, query});
  try {
    const res = await axios.get(
      `${base_url}/${end_point}?page=${page}&limit=${limit}&query=${query}`,
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
    console.log("Res :: ",res);
    if (res?.data && res?.data?.success) {
      return res?.data;
    }
  } catch (error) {
    return [];
  }
}

