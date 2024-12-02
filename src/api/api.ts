import axios from "axios";

export const api = axios.create({
  baseURL: "https://rpgfind-xxezk0za.b4a.run/",
  timeout: 100000,
});
