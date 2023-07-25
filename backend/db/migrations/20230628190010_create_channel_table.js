/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable("channels", function (table) {
            table.increments("uid").unique().primary();
            table.string("channel_name").notNullable();
            table.string("channel_logo");
            table.string("channel_description");
            table.timestamps(false, true);
        })
        .createTable("company_channels", function (table) {
            table.increments("uid").unique().primary();
            table.integer("channel_uid").unsigned().notNullable();
            table.foreign("channel_uid").references("channels.uid").onDelete("CASCADE");
            table.integer("company_uid").unsigned().notNullable();
            table.foreign("company_uid").references("companies.uid").onDelete("CASCADE");
        })
        .createTable("channel_members", function (table) {
            table.increments("uid").unique().primary();
            table.integer("channel_uid").unsigned().notNullable();
            table.foreign("channel_uid").references("channels.uid").onDelete("CASCADE");
            table.integer("user_uid").unsigned().notNullable();
            table.foreign("user_uid").references("users.uid").onDelete("CASCADE");
            table.timestamps(false, true);
        })
        .createTable("rooms", function (table) {
            table.increments("uid").unique().primary();
            table.string("room_name").notNullable();
            table.string("room_logo");
            table.string("room_description");
            table.timestamps(false, true);
        })
        .createTable("channel_rooms", function (table) {
            table.increments("uid").unique().primary();
            table.integer("channel_uid").unsigned().notNullable();
            table.foreign("channel_uid").references("channels.uid").onDelete("CASCADE");
            table.integer("room_uid").unsigned().notNullable();
            table.foreign("room_uid").references("rooms.uid").onDelete("CASCADE");
            table.timestamps(false, true);
        })
        .createTable("messages", function (table) {
            table.increments("uid").unique().primary();
            table.integer("user_uid").unsigned().notNullable();
            table.foreign("user_uid").references("users.uid").onDelete("CASCADE");
            table.string("message_content").notNullable();
            table.integer("is_edited");
            table.timestamps(false, true);
        })
        .createTable("room_messages", function (table) {
            table.increments("uid").unique().primary();
            table.integer("room_uid").unsigned().notNullable();
            table.foreign("room_uid").references("rooms.uid").onDelete("CASCADE");
            table.integer("message_uid").unsigned().notNullable();
            table.foreign("message_uid").references("messages.uid").onDelete("CASCADE");
            table.timestamps(false, true);
        })
        .createTable("threads", function (table) {
            table.increments("uid").unique().primary();
            table.string("thread_title").notNullable();
            table.string("thread_content").notNullable();
            table.integer("user_uid").unsigned().notNullable();
            table.foreign("user_uid").references("users.uid").onDelete("CASCADE");
            table.timestamps(false, true);
        })
        .createTable("channel_threads", function (table) {
            table.increments("uid").unique().primary();
            table.integer("channel_uid").unsigned().notNullable();
            table.foreign("channel_uid").references("channels.uid").onDelete("CASCADE");
            table.integer("thread_uid").unsigned().notNullable();
            table.foreign("thread_uid").references("threads.uid").onDelete("CASCADE");
            table.timestamps(false, true);
        })
        .createTable("comments", function (table) {
            table.increments("uid").unique().primary();
            table.integer("user_uid").unsigned().notNullable();
            table.foreign("user_uid").references("users.uid").onDelete("CASCADE");
            table.string("comment_content").notNullable();
            table.integer("is_edited");
            table.timestamps(false, true);
        })
        .createTable("thread_comments", function (table) {
            table.increments("uid").unique().primary();
            table.integer("thread_uid").unsigned().notNullable();
            table.foreign("thread_uid").references("threads.uid").onDelete("CASCADE");
            table.integer("comment_uid").unsigned().notNullable();
            table.foreign("comment_uid").references("comments.uid").onDelete("CASCADE");
            table.timestamps(false, true);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable("channel_members")
        .dropTable("channel_rooms")
        .dropTable("channel_threads")
        .dropTable("thread_comments")
        .dropTable("room_messages")
        .dropTable("company_channels")
        .dropTable("messages")
        .dropTable("comments")
        .dropTable("threads")
        .dropTable("rooms")
        .dropTable("channels");
};
