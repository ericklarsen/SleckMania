"use client";
import axios from "axios";
// import getConfig from "next/config";
// export const { publicRuntimeConfig } = getConfig();
// export const { FRONT_API } = publicRuntimeConfig;

export const getAccessToken = () => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        // Access localStorage here
        // Your code that uses localStorage goes here
        const appUser = localStorage.getItem("appUser");
        if (!appUser) return false;
        return JSON.parse(appUser).token;
    } else {
        // Handle the case when localStorage is not available
        console.log("localStorage is not supported.");
        return false;
    }
};

type ApiState = {
    method: string;
    url: string;
    data?: any;
    headers?: any;
};

export const apiRequest = ({ method = "GET", url, data = {}, headers = "" }: ApiState) => {
    const apiServer = process.env.NEXT_PUBLIC_API_SERVER as string;
    url = apiServer + "/" + url;

    const accessToken = getAccessToken();
    const defaultHeaders = {
        ...(!headers && {
            "Content-Type": "application/json",
        }),
        ...(accessToken && { "x-access-token": `${accessToken}` }),
    };

    return axios({
        method,
        url,
        data,
        headers: { ...defaultHeaders, ...headers },
    });
};
