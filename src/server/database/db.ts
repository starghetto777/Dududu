/**
 * Подключение к базе данных SQLite через better-sqlite3
 * Singleton паттерн с типизированными обёртками
 * @file db.ts
 */

import Database, { Statement, RunResult } from 'better-sqlite3';
import * as path from 'path';

// Глобальная переменная для хранения экземпляра БД
let dbInstance: Database | null = null;

/**
 * Получает путь к файлу базы данных из переменных окружения
 */
function getDatabasePath(): string {
  const dbPath = process.env.DATABASE_PATH || './data/shop.db';
  return path.resolve(process.cwd(), dbPath);
}

/**
 * Инициализирует подключение к базе данных
 * Создаёт директорию для БД если она не существует
 */
function initDatabase(): Database {
  if (dbInstance) {
    return dbInstance;
  }

  const dbPath = getDatabasePath();
  const fs = require('fs');
  const dir = path.dirname(dbPath);

  // Создаём директорию если не существует
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Создаём подключение
  dbInstance = new Database(dbPath);

  // Включаем WAL mode для лучшей производительности
  dbInstance.pragma('journal_mode = WAL');

  // Включаем поддержку внешних ключей
  dbInstance.pragma('foreign_keys = ON');

  // Увеличиваем кэш страниц
  dbInstance.pragma('cache_size = -64000'); // 64MB

  // Включаем busy timeout
  dbInstance.pragma('busy_timeout = 5000');

  console.log(`База данных подключена: ${dbPath}`);

  return dbInstance;
}

/**
 * Возвращает экземпляр подключения к базе данных (singleton)
 */
export function getDb(): Database {
  if (!dbInstance) {
    dbInstance = initDatabase();
  }
  return dbInstance;
}

/**
 * Типизированная обёртка для получения одной записи
 * @param sql SQL запрос
 * @param params Параметры запроса
 * @returns Одна запись или null
 */
export function queryOne<T>(sql: string, params?: unknown[]): T | null {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.get(params) as T | null;
}

/**
 * Типизированная обёртка для получения всех записей
 * @param sql SQL запрос
 * @param params Параметры запроса
 * @returns Массив записей
 */
export function queryAll<T>(sql: string, params?: unknown[]): T[] {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.all(params) as T[];
}

/**
 * Типизированная обёртка для выполнения INSERT/UPDATE/DELETE
 * @param sql SQL запрос
 * @param params Параметры запроса
 * @returns Результат выполнения
 */
export function execute(sql: string, params?: unknown[]): RunResult {
  const db = getDb();
  const stmt = db.prepare(sql);
  return stmt.run(params) as RunResult;
}

/**
 * Выполняет операцию в транзакции
 * @param fn Функция выполняемая в транзакции
 * @returns Результат функции
 */
export function transaction<T>(fn: () => T): T {
  const db = getDb();
  
  const transactionFn = db.transaction(() => {
    return fn();
  });

  return transactionFn();
}

/**
 * Закрывает подключение к базе данных
 */
export function closeDb(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    console.log('Подключение к базе данных закрыто');
  }
}

/**
 * Проверяет подключение к базе данных
 */
export function checkConnection(): boolean {
  try {
    const db = getDb();
    db.prepare('SELECT 1').get();
    return true;
  } catch (error) {
    console.error('Ошибка подключения к базе данных:', error);
    return false;
  }
}

// Экспортируем экземпляр БД по умолчанию
export default getDb();
