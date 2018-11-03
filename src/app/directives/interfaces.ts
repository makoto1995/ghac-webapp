export interface Result<T> {
    success: boolean;
    data: T;
    token: string;
    error: string;
}
export interface User {
    userName: string;
    userPwd: string;
    userId: string;
    privileges: UserPrivileges;
}
export interface UserPrivileges {
    canGetMonitor: boolean;
    canModifyDisplay: boolean;
    canModifyUser: boolean;
    canDownloadReport: boolean;
    canViewHistory: boolean;
}
