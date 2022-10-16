import { RolesBuilder } from "nest-access-control";

export enum AppRoles {
    ADMIN = 'ADMIN',
    READER = 'READER',
  }
  
export const roles: RolesBuilder = new RolesBuilder();
  
roles
    .grant(AppRoles.READER) // define new or modify existing role. also takes an array.
        .readAny(['post'])
    .grant(AppRoles.ADMIN) // switch to another role without breaking the chain
        .extend(AppRoles.READER) // inherit role capabilities. also takes an array
        .createAny(['post']) // equivalent to .createOwn('video', ['*'])
        .updateAny(['post'])
        .deleteAny(['post']);