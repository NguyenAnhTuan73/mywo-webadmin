export interface DataType {
	no: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	current_plan: any;
	plan_expired_time: any;
	points: any;
	plans: any;
	_id: string;
	send: boolean;
	role: string;
	showOnResponse?: boolean;
	status: any;
	email: string;
	tmp_email: string;
	start?: string;
	deposit_time: string;
	purchase_time: string;
	deposit_amount: string;
	amount: string;
	start_amount: string;
}

export interface TypeObjParams {
	search: string;
	page: number;
	size: number;
	status?: string;
	current_plan?: string;
	app_version?: string;
}

export interface TypeSelect {
	title: string;
	key: number;
	value: any;
}

export interface TypeDataUser {
	first_name: string;
	last_name: string;
	email: string;
	status: any;
	auth_type: string;
}
