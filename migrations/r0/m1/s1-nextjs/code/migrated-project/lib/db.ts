import mysql, { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST ?? "localhost",
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER ?? "root",
      password: process.env.DB_PASSWORD ?? "MysqlEragon44!",
      database: process.env.DB_NAME ?? "silent_auction",
      waitForConnections: true,
      connectionLimit: 10,
    });
  }
  return pool;
}

type QueryParam = string | number | boolean | null | Date | Buffer;

export async function query<T extends RowDataPacket>(
  sql: string,
  params: QueryParam[] = [],
): Promise<T[]> {
  const [rows] = await getPool().execute<T[]>(sql, params);
  return rows;
}

export async function execute(
  sql: string,
  params: QueryParam[] = [],
): Promise<ResultSetHeader> {
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
}
