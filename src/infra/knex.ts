import Knex from "knex";
import config from "../../knexfile";
const knexStringCase = require("knex-stringcase");

export const knex = Knex(knexStringCase(config))