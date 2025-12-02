import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "@/entities/Usuario";
import { Chave } from "@/entities/Chave";
import { Transacao } from "@/entities/Transacao";

const {
  DB_HOST = "localhost",
  DB_PORT = "3306",
  DB_USER = "root",
  DB_PASSWORD = "",
  DB_NAME = "pix_db",
} = process.env;

declare global {
  var __dataSource: DataSource | undefined;
}

export const AppDataSource =
  global.__dataSource ??
  new DataSource({
    type: "mysql",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Usuario, Chave, Transacao],
  });

if (!global.__dataSource) global.__dataSource = AppDataSource;
