import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Spin, Space, Switch, message } from 'antd';
import {
	UserOutlined,
	HomeOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { getDashboard, getVnpStatus, updateVnpStatus } from '../../service/user/UserService';
import { Column } from '@ant-design/plots';
import './DashBoard.scss';
import { TypeData } from '../../interface/manage.interface';
import { getAccessToken } from '../../helper/tokenHelper';

export default function DashBoard() {
	const [dashboarDisplay, setDashboarDisplay] = useState<TypeData>({
		numFamily: 0,
		numUser: 0,
		userOfDate: {},
	});

	const [ vnpStatus, setVnpStatus] =  useState(false);

	const getDataDashboard = async() =>{
		setIsSpin(true)
		try {
			const res = await getDashboard()
			setDashboarDisplay({
				numFamily: res.data.results.numFamily,
				numUser: res.data.results.numUser,
				userOfDate: res.data.results.userOfDate,
			});

			const vnpStatus = await getVnpStatus()
			console.log(vnpStatus)
			setVnpStatus(vnpStatus.data.data.enable);

			setIsSpin(false)
			
		} catch (error) {
			setIsSpin(false)
		}
	}

	useEffect(() => {
		getDataDashboard()
	}, [getAccessToken()]);

	const [isSpin, setIsSpin] = useState(true);
	let data = [];
	let total = 0;
	for (var key of Object.keys(dashboarDisplay.userOfDate)) {
		total += dashboarDisplay.userOfDate[key].length;

		let dt = {
			dayValue: new Date(key).getTime(),
			day: moment(key).format('DD-MM'),
			value: dashboarDisplay.userOfDate[key].length,
		};
		if (dt.value > 0) {
			data.push(dt as any);
		}
	}

	data.sort((a: any, b: any) => a.dayValue - b.dayValue);

	const config: any = {
		data,
		xField: 'day',
		yField: 'value',
		label: {
			position: 'middle',
			style: {
				fill: '#FFFFFF',
				opacity: 0.6,
			},
		},
		xAxis: {
			label: {
				autoHide: true,
				autoRotate: true,
			},
		},
	};

	const handleSwitchStatus = async(status : boolean) => {
		console.log(status);
		try {
			const objParam = {
				enable : status
			};
			const res = await updateVnpStatus(objParam);
			if(res.data.status == true) {
				if(status) {
					message.success("You just turn on Vn Pay");
				} else {
					message.success("You just turn off Vn Pay");
				}
				
				setVnpStatus(status);
			}
			console.log(res);
			
		} catch (error) {
			console.log(error);
		}
    };

	return (
		<div>
			{isSpin ?
				<div className=' h-screen flex justify-center items-center'>
					<Spin size="large" spinning={isSpin} />

				</div>
				:
				<>
					<div className="bg-white p-5 sm:p-2 my-10 sm:my-5 rounded-lg">
						<h1 className="text-xl sm:text-base sm:font-semibold sm:mb-2">Analytics Dashboard</h1>
						<p>
							Manage web environment design, deployment, development and maintenance activities. Perform testing
							and quality assurance of web sites and web applications
						</p>
					</div>
					<div className="bg-white p-5 sm:p-2 my-10 sm:my-5 rounded-lg">
						<h1 className="text-xl sm:text-base mb-3">Portfolio Performance</h1>
						<div className="flex  sm:justify-center ">
							<div className="w-1/3 sm:w-full sm:mb-2 flex items-center sm:bock sm:text-center sm:flex-col">
								<UserOutlined className="image-dashboard mr-3 " />
								<p className="mb-0 text-[1rem]  font-medium">{dashboarDisplay.numUser} People</p>
							</div>
							<div className="w-1/3 sm:w-full sm:mb-2 flex items-center sm:bock sm:text-center sm:flex-col">
								<HomeOutlined className="image-dashboard mr-3" />
								<p className="mb-0 text-[1rem] font-medium">{dashboarDisplay.numFamily} Families</p>
							</div>
							<div className="w-1/3 sm:w-full flex items-center sm:bock sm:text-center sm:flex-col">
								<TeamOutlined className="image-dashboard mr-3 " />
								<p className="mb-0 text-[1rem] font-medium">{total} New users</p>
							</div>
						</div>
					</div>
					<div className="bg-white p-5 sm:p-2 my-10 sm:my-5 rounded-lg">
						<h1 className="text-xl sm:text-base mb-9">
							The bar chart shows the number of new users per day for the last 30 days
						</h1>
						<Column {...config} />
					</div>
					<div className="bg-white p-5 sm:p-2 my-10 sm:my-5 rounded-lg">
						<h1 className="text-xl sm:text-base mb-9">
							This switch button to show on / off VNPAY
						</h1>
						<Space size="middle">
							<Switch
								checked = { vnpStatus ? vnpStatus : false }
								onChange={() => {
									handleSwitchStatus(!vnpStatus);
								}}
							/>
						</Space>
					</div>
				</>

			}

		</div>
	);
}
