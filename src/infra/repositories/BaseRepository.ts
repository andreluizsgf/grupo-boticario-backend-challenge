import { Knex } from "knex";
import { v4 } from "uuid";
import { IBaseRepository } from "../../domain/database/repositories/IBaseRepository";
import { BaseModel } from "../../domain/entities/Base";
import { knex } from "../knex";

export type Insert<T extends BaseModel> = Omit<T, "createdAt" | "updatedAt" | "id"> & {
    id?: string
    createdAt?: Date
    updatedAt?: Date
}

export type Filter<T extends BaseModel> = Partial<Omit<T, "createdAt" | "updatedAt">>;

export default class BaseRepository<T extends BaseModel> implements IBaseRepository<T> {
    constructor(private readonly tableName: string) {}

    private select() {
        return knex<T>(this.tableName).select();
    }

    async insert(item: Insert<T>) {
        const now = new Date();

        return (await knex(this.tableName).insert({
            id: v4(),
            ...item,
            createdAt: now,
            updatedAt: now
        }).returning('*'))[0] as T
    }

    async get(id: string) {
        return (await knex(this.tableName).select('*').where({id}).first()) as T | undefined;
    }

    async delete(id: string) {
        return (await knex(this.tableName).delete('*').where({id}).first()) as T | undefined;
    }

    async findOneBy(condition: Filter<T>) {
        return this.select().where(condition).first() as Promise<T | undefined>;
    }

    async paginate(currentPage = 1, perPage = 10, condition: Filter<T>) {
        const query = this.select().where(condition).count({ count: 1 }).first();
        const total = parseInt(((await query)?.count ?? "0").toString(), 10);

        const result = (await this.select()
            .where(condition)
            .limit(perPage)
            .offset((currentPage - 1) * perPage)) as T[];

        return {
            data: result,
            pagination: {
                currentPage,
                lastPage: Math.ceil(total / perPage),
                perPage,
                total
            }
        };
    }
}