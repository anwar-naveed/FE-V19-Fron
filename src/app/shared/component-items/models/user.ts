export interface CreateUser {
  name: string,
  username: string,
  password: string,
  roleId: bigint
}

export interface UpdateUser {
  id: bigint,
  name: string,
  username: string,
  password: string,
  isActive: boolean
}

export interface User {
  id: bigint,
  name: string,
  username: string,
  // isActive: boolean,
  // createdOn: Date,
  // modifiedOn: Date
}
export type UserArray = User[];


// export interface LoginRequest {
//   login: string;
//   password: string;
// }

// export interface Login {
//   login: string,
//   password: string,
//   user: User,
//   token: string;
// }

// export interface User {
//   id: string;
//   fullName: string;
//   roleId: number;
//   phone: string;
//   mobile: string;
//   email: string;
//   customerId: string;
//   role: Role;
//   status: number,
//   secretQuestion: string,
//   secretAnswer: string,
//   overseasAgentId: string,
//   linkPartyId: string,
//   employeeId: string,
//   salesTeamId: string,
//   buyerId: string,
//   branchOfficeId: string,
//   lastLogin: Date,
//   companyId: string,
//   createUserId: string,
//   createTime: string,
//   editUserId: string,
//   editTime: string
//   // username: string;
//   // bio: string;
//   // image: string;
// }

// export interface Role {
//   name: string,
//   roleType: number,
//   roleRights: [],
//   users: [],
//   id: number,
//   companyId: string,
//   createUserId: string,
//   createTime: string,
//   editUserId: string,
//   editTime: string
// }

// export interface UserResponse {
//   user: User;
// }


// "{
//   "login": "YWRtaW4=",
//   "password": null,
//   "user": {
//     "id": "admin",
//     "fullName": "Admin",
//     "roleId": 1,
//     "phone": null,
//     "mobile": null,
//     "email": "Admin@Admin.com",
//     "customerId": null,
//     "role": {
//       "name": "ADMIN",
//       "roleType": 1,
//       "roleRights": [],
//       "users": [],
//       "id": 1,
//       "companyId": null,
//       "createUserId": null,
//       "createTime": null,
//       "editUserId": null,
//       "editTime": null
//     },
//     "status": 1,
//     "secretQuestion": null,
//     "secretAnswer": null,
//     "overseasAgentId": null,
//     "linkPartyId": null,
//     "employeeId": null,
//     "salesTeamId": null,
//     "buyerId": null,
//     "branchOfficeId": null,
//     "lastLogin": "2023-07-29T12:09:28.6581894Z",
//     "companyId": null,
//     "createUserId": null,
//     "createTime": null,
//     "editUserId": null,
//     "editTime": null
//   },
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFkbWluIiwiVGVuYW50SWQiOiIiLCJDdXN0b21lcklkIjoiIiwiVXNlcklkIjoiYWRtaW4iLCJSb2xlSWQiOiIxIiwiT3ZlclNlYXNBZ2VudElkIjoiIiwiTGlua1BhcnR5SWQiOiIiLCJFbXBsb3llZUlkIjoiIiwic2NvcGUiOlsiYXBpMS5yZWFkIiwib3BlbmlkIiwicHJvZmlsZSJdLCJuYmYiOjE2OTA2MzI1NjgsImV4cCI6MTY5MDczMjU2OCwiaWF0IjoxNjkwNjMyNTY4LCJpc3MiOiJNZSIsImF1ZCI6IllvdSJ9.K0cqcanHfoj1AMgADroMJtgA6Bq-N7My3K7rJPOHJHU"
// }"