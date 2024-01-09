import React from 'react';
import {  Result } from 'antd';
import { Link } from 'react-router-dom';

export default function NotFountPage() {
	return (
		<div>
			<Result
				status="404"
				title="404"
				subTitle="Sorry, the page you visited does not exist."
				extra={
					<Link to="/authenticate" className="ant-btn ant-btn-primary">
						Back to login
					</Link>
				}
			/>
		</div>
	);
}
