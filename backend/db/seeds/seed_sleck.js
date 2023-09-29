const bcrypt = require("bcryptjs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex("users").del();
    await knex("users").insert([
        {
            uid: 1,
            username: "erick",
            email: "e.larsen@2viz",
            password: bcrypt.hashSync("123123123", 8),
            first_name: "Erick",
            last_name: "Larsen",
            phone: "123123123",
            avatar_img: "4ec7b5ee-4569-40ae-b2c2-4b009996ac96-1688158497053.webp",
            permission_state: 2,
        },
        {
            uid: 2,
            username: "maiks",
            email: "maiks@2viz",
            password: bcrypt.hashSync("123123123", 8),
            first_name: "Maiks",
            last_name: "larsen",
            phone: "123123123",
            avatar_img: "4ec7b5ee-4569-40ae-b2c2-4b009996ac96-1688158497053.webp",
            permission_state: 1,
        },
        {
            uid: 3,
            username: "maiks 2",
            email: "maiks 2@2viz",
            password: bcrypt.hashSync("123123123", 8),
            first_name: "Maiks 2",
            last_name: "larsen",
            phone: "123123123",
            avatar_img: "4ec7b5ee-4569-40ae-b2c2-4b009996ac96-1688158497053.webp",
            permission_state: 1,
        },
        {
            uid: 4,
            username: "maiks 3",
            email: "maiks 3@2viz",
            password: bcrypt.hashSync("123123123", 8),
            first_name: "Maiks 3",
            last_name: "larsen",
            phone: "123123123",
            avatar_img: "4ec7b5ee-4569-40ae-b2c2-4b009996ac96-1688158497053.webp",
            permission_state: 1,
        },
    ]);

    await knex("users_token").del();
    await knex("users_token").insert([
        {
            uid: 1,
            user_uid: 1,
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3VpZCI6MSwicGVybWlzc2lvbl9zdGF0ZSI6MiwiY29tcGFueV91aWQiOjEsImlhdCI6MTY4ODI0MTg1MX0.2Q1L1Uzn0k4qO4guWWRFnJl7usFdOLoRBJwFIA0wgeo",
        },
        {
            uid: 2,
            user_uid: 2,
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3VpZCI6MiwicGVybWlzc2lvbl9zdGF0ZSI6MSwiaWF0IjoxNjg4MjQyMDM2fQ.r_qPiOXl3itBeYyqrQRPCPex8iPb_TeQzmUTld1Fzpk",
        },
    ]);

    await knex("companies").del();
    await knex("companies").insert([
        {
            uid: 1,
            company_name: "2VIZ",
            company_logo: "93a75f61-f653-4eca-b3ba-da0424919810-1688214607181.webp",
        },
        {
            uid: 2,
            company_name: "RCI",
            company_logo: "93a75f61-f653-4eca-b3ba-da0424919810-1688214607181.webp",
        },
    ]);

    await knex("company_members").del();
    await knex("company_members").insert([
        {
            company_uid: 1,
            user_uid: 1,
            permission_state: 3, // super member
        },
        {
            company_uid: 2,
            user_uid: 2,
            permission_state: 2, // admin member
        },
        {
            company_uid: 2,
            user_uid: 3,
            permission_state: 1, // normal member
        },
        {
            company_uid: 1,
            user_uid: 4,
            permission_state: 1, // normal member
        },
    ]);

    await knex("channels").del();
    await knex("channels").insert([
        {
            uid: 1,
            channel_name: "Dolorean",
            channel_logo: "e105aef6-6278-4aaa-816b-c6031df6d8c9-1688158704527.jpeg",
            channel_description: "This is for dolorean",
        },
        {
            uid: 2,
            channel_name: "SIKAT!",
            channel_logo: "e105aef6-6278-4aaa-816b-c6031df6d8c9-1688158704527.jpeg",
            channel_description: "This is for SIKAT!",
        },
        {
            uid: 3,
            channel_name: "TAKIS!",
            channel_logo: "e105aef6-6278-4aaa-816b-c6031df6d8c9-1688158704527.jpeg",
            channel_description: "This is for TAKIS!",
        },
        {
            uid: 4,
            channel_name: "TAKIS! v2",
            channel_logo: "e105aef6-6278-4aaa-816b-c6031df6d8c9-1688158704527.jpeg",
            channel_description: "This is for TAKIS! v2",
        },
    ]);

    await knex("company_channels").del();
    await knex("company_channels").insert([
        {
            uid: 1,
            channel_uid: 1,
            company_uid: 1,
        },
        {
            uid: 2,
            channel_uid: 2,
            company_uid: 1,
        },
        {
            uid: 3,
            channel_uid: 3,
            company_uid: 2,
        },
        {
            uid: 4,
            channel_uid: 4,
            company_uid: 2,
        },
    ]);

    await knex("channel_members").del();
    await knex("channel_members").insert([
        {
            uid: 1,
            channel_uid: 1,
            user_uid: 1,
        },
        {
            uid: 2,
            channel_uid: 3,
            user_uid: 2,
        },
        {
            uid: 3,
            channel_uid: 1,
            user_uid: 3,
        },
        {
            uid: 4,
            channel_uid: 3,
            user_uid: 3,
        },
        {
            uid: 5,
            channel_uid: 4,
            user_uid: 3,
        },
    ]);

    await knex("rooms").del();
    await knex("rooms").insert([
        {
            uid: 1,
            room_name: "Task",
            room_logo: "",
            room_description: "Room for task",
        },
        {
            uid: 2,
            room_name: "Daily Discussion",
            room_logo: "",
            room_description: "Room for Daily Discussion",
        },
    ]);

    await knex("channel_rooms").del();
    await knex("channel_rooms").insert([
        {
            uid: 1,
            room_uid: 1,
            channel_uid: 1,
        },
        {
            uid: 2,
            room_uid: 2,
            channel_uid: 3,
        },
    ]);

    await knex("messages").del();
    await knex("messages").insert([
        {
            uid: 1,
            user_uid: 1,
            message_content: "Up for a call?",
            is_edited: 0,
        },
        {
            uid: 2,
            user_uid: 2,
            message_content: "Brooo?",
            is_edited: 0,
        },
    ]);

    await knex("room_messages").del();
    await knex("room_messages").insert([
        {
            uid: 1,
            room_uid: 1,
            message_uid: 1,
        },
        {
            uid: 2,
            room_uid: 2,
            message_uid: 2,
        },
    ]);

    await knex("threads").del();
    await knex("threads").insert([
        {
            uid: 1,
            user_uid: 1,
            thread_title: "Sikat Mania",
            thread_content: "it's all about sikat mania mantap",
        },
        {
            uid: 2,
            user_uid: 1,
            thread_title: "BEST 10 OSINT",
            thread_content: "#1. SIKAT From Sony Arianto Kurniawan",
        },
        {
            uid: 3,
            user_uid: 1,
            thread_title: "RIVIERA TEAM",
            thread_content: "RCI CLONE",
        },
        {
            uid: 4,
            user_uid: 3,
            thread_title: "DISNEY",
            thread_content: "DISNEY CLONE",
        },
        {
            uid: 5,
            user_uid: 4,
            thread_title: "MAGIC AHOY",
            thread_content: "MAGIC AHOY CLONE",
        },
    ]);

    await knex("channel_threads").del();
    await knex("channel_threads").insert([
        {
            uid: 1,
            channel_uid: 1,
            thread_uid: 1,
        },
        {
            uid: 2,
            channel_uid: 1,
            thread_uid: 2,
        },
        {
            uid: 3,
            channel_uid: 2,
            thread_uid: 3,
        },
        {
            uid: 4,
            channel_uid: 1,
            thread_uid: 4,
        },
        {
            uid: 5,
            channel_uid: 3,
            thread_uid: 5,
        },
    ]);

    await knex("comments").del();
    await knex("comments").insert([
        {
            uid: 1,
            user_uid: 1,
            comment_content: "Terlalu Gokil!",
            is_edited: 0,
        },
        {
            uid: 2,
            user_uid: 1,
            comment_content: "Semakin Mantap!",
            is_edited: 0,
        },
        {
            uid: 3,
            user_uid: 4,
            comment_content: "Datanya sedikit!",
            is_edited: 0,
        },
    ]);

    await knex("thread_comments").del();
    await knex("thread_comments").insert([
        {
            uid: 1,
            thread_uid: 1,
            comment_uid: 1,
        },
        {
            uid: 2,
            thread_uid: 1,
            comment_uid: 2,
        },
        {
            uid: 3,
            thread_uid: 5,
            comment_uid: 3,
        },
    ]);
};
