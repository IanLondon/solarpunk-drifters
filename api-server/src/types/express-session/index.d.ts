// Extend SessionData: eg allow req.session.userId

// to make the file a module and avoid the TypeScript error
export {}

declare module 'express-session' {
  interface SessionData {
    uid?: number
  }
}
