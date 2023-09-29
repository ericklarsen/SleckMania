import { UserDetailsType } from "@/types";

type GetImageFromServerType = {
    type: "channels" | "rooms" | "users" | "comments" | "threads" | "messages";
    filename: string | undefined;
};
export const getImageFromServer = ({ type, filename }: GetImageFromServerType) => {
    return `${process.env.NEXT_PUBLIC_ASSET_SERVER}/${type}/${filename}`;
};

export const isCompanyAdmin = () => {
    const appUser = JSON.parse(localStorage.getItem("appUser") as any) as UserDetailsType;

    if ([2, 3].includes(appUser.company.permission_state)) return true;
    return false;
};
