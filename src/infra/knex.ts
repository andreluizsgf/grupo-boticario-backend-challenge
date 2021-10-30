import Knex from 'knex';
import config from '../../knexfile';
import { attachPaginate } from 'knex-paginate';
attachPaginate();

const knexStringCase = require('knex-stringcase');

export const knex = Knex(knexStringCase(config));
