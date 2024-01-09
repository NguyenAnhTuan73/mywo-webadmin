export interface AuthInterface {
	email: string;
	password: string;
}
export interface TypeDataAddPointUser {
	user_id: string;
	point: number;
}
export interface TypeDataListPoint {
	user_id: string;
	appStoreName: string;
}
export interface ManualPage {
	id?: string;
	name: string;
	url: string;
}
