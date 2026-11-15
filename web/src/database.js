import initSqlJs from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

export const families = ['open_floor', 'narrow_corridor', 'cluttered_aisles'];
export const methods = ['adaptive', 'uniform', 'fixed'];
export const label = s => s.replaceAll('_', ' ').replace(/^./, c => c.toUpperCase());

export async function createDatabase() {
  const SQL = await initSqlJs({ locateFile: () => wasmUrl });
  const db = new SQL.Database();
  db.run(`CREATE TABLE episodes (
    id INTEGER PRIMARY KEY, run_id TEXT NOT NULL, method TEXT NOT NULL,
    family TEXT NOT NULL, difficulty INTEGER NOT NULL CHECK(difficulty BETWEEN 1 AND 3),
    episode_index INTEGER NOT NULL, success INTEGER NOT NULL CHECK(success IN (0,1)),
    steps INTEGER NOT NULL CHECK(steps BETWEEN 1 AND 200), collisions INTEGER NOT NULL,
    reward REAL NOT NULL, source TEXT NOT NULL CHECK(source='mock'), ended_at TEXT NOT NULL
  ); CREATE INDEX by_method ON episodes(method, id);
  CREATE INDEX by_family ON episodes(family, id);`);
  let state = 42;
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
  const insert = db.prepare('INSERT INTO episodes VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
  db.run('BEGIN');
  let id = 0;
  for (const method of methods) for (let seed = 1; seed <= 5; seed++) {
    for (let episode = 1; episode <= 1200; episode++) {
      const family = families[Math.floor(random() * 3)];
      const difficulty = 1 + Math.floor(random() * 3);
      // Deliberately fictional learning curves for UI demonstration, not a scientific comparison.
      const progress = episode / 1200;
      const chance = Math.min(.94, .18 + progress * ({ adaptive: .72, uniform: .55, fixed: .63 }[method]) - .035 * (difficulty - 1));
      const success = Number(random() < chance);
      const steps = success ? Math.floor(12 + random() * (80 - 35 * progress)) : 200;
      const collisions = Math.floor(random() * steps * (.16 - .08 * progress));
      const reward = Number((-steps * .01 - collisions * .05 + success).toFixed(3));
      id++;
      insert.run([id, `mock-${method}-${seed}`, method, family, difficulty, episode, success, steps, collisions, reward, 'mock', new Date(Date.UTC(2026, 10, 15) + id * 2000).toISOString()]);
    }
  }
  db.run('COMMIT'); insert.free();
  return db;
}

export function query(db, sql, values = []) {
  const statement = db.prepare(sql);
  try { statement.bind(values); const rows = []; while (statement.step()) rows.push(statement.getAsObject()); return rows; }
  finally { statement.free(); }
}
