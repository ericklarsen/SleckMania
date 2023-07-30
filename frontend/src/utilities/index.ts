type GetImageFromServerType = {
    type: string;
    filename: string | undefined;
};
export const getImageFromServer = ({ type, filename }: GetImageFromServerType) => {
    return `${process.env.NEXT_PUBLIC_ASSET_SERVER}/${type}/${filename}`;
};
