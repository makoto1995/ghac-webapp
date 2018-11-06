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
export interface Factory {
    factoryId: number;
    factoryName: string;
}
export interface Line {
    lineId: number;
    lineName: string;
    factoryId: number;
}
export interface Place {
    placeId: number;
    placeName: string;
    lineId: number;
}
export interface IOPoint {
    id: number;
    address: string;
    type: string;
    placeId: number;
    lineId: number;
    factoryId: number;
    value: number;
}
