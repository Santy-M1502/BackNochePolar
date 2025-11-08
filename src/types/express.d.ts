import { Usuario } from '../modules/usuarios/schema/usuarios.schema';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Usuario & { _id: string };
  }
}
