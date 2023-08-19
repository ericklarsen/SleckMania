export type UserDetailsType = {
    uid: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    permission_state: boolean;
    created_at: string;
    updated_at: string;
    avatar_img: string;
    token: string;
    company: {
        company_logo: string;
        company_name: string;
        company_uid: number;
        permission_state: number;
    };
};
