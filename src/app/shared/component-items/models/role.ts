export interface CreateRole {
    name: string,
  }

export interface UpdateRole {
    id: bigint,
    name: string,
    isActive: boolean
  }

export interface Role {
    id: bigint,
    name: string,
    // isActive: boolean,
    // createdOn: Date,
    // modifiedOn: Date
  }
  export type RoleArray = Role[];