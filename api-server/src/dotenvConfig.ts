import dotenv from 'dotenv'
import path from 'path'

// Single point of dotenv config, to resolve import ordering issues
// (eg, if we import dotenv in index.ts, import other stuff, then finally do
// dotenv.config(), it will be too late for that other stuff we imported
// to use process.env correctly)
dotenv.config({ path: path.join(__dirname, '..', '.env') })
