//@ts-nocheck
import { PUBLIC_API_URI } from "$env/static/public";
import { toast } from "svelte-sonner";

export const httpClient = async (
  endpoint,
  config = {
    method: "GET",
  }
) => {
  let url = `${PUBLIC_API_URI}${endpoint}`;
  let options = {
    method: config.method,
  };

  let headers = new Headers();

  if (config.token) {
    headers.append("Authorization", `Bearer ${config.token}`);
  }

  if (config.payload) {
    headers.append("Content-Type", "application/json");
    options.body = JSON.stringify(config.payload);
  }

  if (config.formData) {
    options.body = config.formData;
  }

  if (config.queryParams) {
    url += `?${new URLSearchParams(config.queryParams).toString()}`;
  }

  options.headers = headers;

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (data.status && data.status !== 200) {
      toast.error(
        data.messages && data.messages.length
          ? data.messages.join(" ")
          : "Something Went Wrong!"
      );
    }
    return data;
  } catch {
    toast.error("Failed to connect server!");
  }
};
