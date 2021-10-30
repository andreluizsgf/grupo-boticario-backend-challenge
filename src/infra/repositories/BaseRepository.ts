import { v4 } from "uuid";
import { IBaseRepository } from "../../domain/database/repositories/IBaseRepository";
import { BaseModel } from "../../domain/entities/Base";
import { knex } from "../knex";

export type Insert<T extends BaseModel> = Omit<T, "createdAt" | "updatedAt" | "id"> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface Pagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: Pagination;
}

export type Filter<T extends BaseModel> = Partial<Omit<T, "createdAt" | "updatedAt">>;

export default class BaseRepository<T extends BaseModel> implements IBaseRepository<T> {
  constructor(private readonly tableName: string) {}

  private select() {
    return knex<T>(this.tableName).select();
  }

  async insert(item: Insert<T>) {
    const now = new Date();

    return (
      await knex(this.tableName)
        .insert({
          id: v4(),
          ...item,
          createdAt: now,
          updatedAt: now,
        })
        .returning("*")
    )[0] as T;
  }

  async get(id: string) {
    return (await knex(this.tableName).select("*").where({ id }).first()) as T | undefined;
  }

  async delete(id: string) {
    return (await knex(this.tableName).delete("*").where({ id }).first()) as T | undefined;
  }

  async findOneBy(condition: Filter<T>) {
    return this.select().where(condition).first() as Promise<T | undefined>;
  }
}
