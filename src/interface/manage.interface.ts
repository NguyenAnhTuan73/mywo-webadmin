export interface TypeStatus {
	title: string;
	key: number;
	value: number;
}

export interface TypeData {
	numFamily?: number;
	numUser: number;
	userOfDate: any;
	numGroup: number;
}

// list user interface
interface TypePoints {
	id: string;
	is_deleted: boolean;
	plan_expired_time: number;
	point: number;
	point_type: number;
	_id: string;
	user_id: string;
}

export interface TypeListUser {
	auth_type?: string;
	avatar?: any;
	current_plan: string;
	email: string;
	first_name?: string;
	last_name?: string;
	name: string;
	point_code: string;
	points: TypePoints[];
	status: string;
	plans?: any;
	_id: string;
}

// list family
interface TypeUserInfo {
	auth_type?: string;
	avatar?: any;
	current_plan: string;
	email: string;
	first_name?: string;
	last_name?: string;
	plan_expired_time: string;
	point_code: string;
	social_id: string;
	_id: string;
	status: string;
}
export interface TypeDataItem {
	_id: string;
	family: string;
	role: string;
	status: string;
	user: string;
	userInfo: TypeUserInfo[];
}
// devices
interface TypeUser {
	auth_type?: string;
	avatar?: any;
	current_plan: string;
	email: string;
	first_name?: string;
	last_name?: string;
	last_plan: string;
	plan_expired_time: string;
	point_code: string;
	social_id: string;
	_id: string;
	status: string;
}

export interface TypeDataDevices {
	app_version: string;
	currency: string;
	device_id: string;
	device_model: string;
	language: string;
	os_version: string;
	user_id: string;
	_id: string;
	user: TypeUser[];
	index: number;
}

//  tutorial

export interface TypeDataManual {
	content: string;
	id: string;
	index: number;
	name: string;
	url: string;
}

// point list
interface TypePoint {
	id: string;
	is_deleted: boolean;
	point: number;
	point_type: number;
	user_id: string;
	_id: string;
}
interface TypeUserPoint {
	appstore_name: string;
	auth_type: string;
	avatar: any;
	current_plan: string;
	email: string;
	first_name: string;
	last_name: string;
	plan_expired_time: string;
	point_code: string;
	social_id: string;
	status: string;
	_id: string;
}
export interface TypeDataPoint {
	user_id: string;
	_id: string;
	point: TypePoint;
	user: TypeUserPoint;
}

// Email template
export interface TypeEmailTemplate {
	created_date: string;
	html: string;
	is_deleted: boolean;
	modified_date: string;
	title: string;
	variables: string[];
	_id: string;
}
