/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable("users", function (table) {
            table.increments("uid");
            table.string("username").unique().notNullable();
            table.string("email").unique().notNullable();
            table.string("password").notNullable();
            table.string("first_name").notNullable();
            table.string("last_name").notNullable();
            table.string("phone").notNullable();
            table.integer("permission_state");
            table.timestamps(false, true);
        })
        .createTable("users_avatar", function (table) {
            table.increments("uid").unique();
            table.integer("user_uid").unsigned().notNullable();
            table.foreign("user_uid").references("users.uid").onDelete("CASCADE");
            table.text("filename");
            table.timestamps(false, true);
        })
        .createTable("companies", function (table) {
            table.increments("uid");
            table.string("company_name").notNullable();
            table.string("company_logo");
            table.timestamps(false, true);
        })
        .createTable("company_members", function (table) {
            table.increments("uid");
            table.integer("company_uid").unsigned().notNullable();
            table.foreign("company_uid").references("companies.uid").onDelete("CASCADE");
            table.integer("user_uid").unsigned().notNullable();
            table.foreign("user_uid").references("users.uid").onDelete("CASCADE");
            table.integer("permission_state").notNullable();
            table.timestamps(false, true);
        })
        .createTable("users_company", function (table) {
            table.increments("uid");
            table.integer("user_uid").unsigned().notNullable();
            table.integer("company_uid").unsigned().notNullable();
            table.foreign("user_uid").references("users.uid").onDelete("CASCADE");
            table.foreign("company_uid").references("companies.uid").onDelete("CASCADE");
            table.timestamps(false, true);
        })
        .createTable("users_token", function (table) {
            table.increments("uid");
            table.integer("user_uid").unsigned().notNullable();
            table.foreign("user_uid").references("users.uid").onDelete("CASCADE");
            table.string("token").notNullable();
            table.timestamps(false, true);
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema
        .dropTable("users_company")
        .dropTable("users_avatar")
        .dropTable("users_token")
        .dropTable("company_members")
        .dropTable("companies")
        .dropTable("users");
};
