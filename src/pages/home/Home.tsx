import React, { useState,  } from 'react';
import { Layout, Menu,  } from 'antd';
import type { MenuProps } from 'antd';
import {
	UserOutlined,
	BellOutlined,
	DownOutlined,
	MobileOutlined,
	HomeOutlined,
	TeamOutlined,
	DashboardOutlined,
	ToolOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { configApp } from '../../config/config';
import { deleteAccessToken, deleteRefreshToken, deleteUserAndPasswordLocal,  } from '../../helper/tokenHelper';
import './Home.scss';

export default function Home() {
	// const navigate = useNavigate();

	type MenuItem = Required<MenuProps>['items'][number];
	const { Header, Sider, Content, Footer } = Layout;
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);

	function getItem(
		label: React.ReactNode,
		key?: React.Key | null,
		icon?: React.ReactNode,
		children?: MenuItem[],
		type?: 'group',
	): MenuItem {
		return {key,icon,children,label,type,} as MenuItem;
	}

	const items: MenuItem[] = [
		getItem(
			'DASHBOARD',
			'/dashboard',
			<DashboardOutlined />,
			// [getItem('GET USERS', '/list-user')]
		),
		getItem(
			'LIST USERS',
			'/list-user',
			<TeamOutlined />,
			// [getItem('GET USERS', '/list-user')]
		),
		getItem(
			'LIST FAMILY',
			'/list-family',
			<HomeOutlined />,
			//  [getItem('GET FAMILY', '/list-family')]
		),
		getItem('LIST DEVICES', '/list-devices', <ToolOutlined />),
		getItem(
			'TUTORIALS',
			'/tutorials',
			<MobileOutlined />,
			// [getItem('GET DEVICES', '/list-devices')]
		),
	];

	const handleLogout = () => {
		const accessToken = localStorage.getItem(configApp.tokenKey);
		deleteUserAndPasswordLocal();
		deleteAccessToken();
		deleteRefreshToken();
		navigate('/authenticate');
	};

	const handleChangePass = () => {
		navigate('/change-password');
	};

	const onClick: MenuProps['onClick'] = e => {
		navigate(e.key);
	};
	return (
		<Layout className="min-h-screen">
			<Sider className="siderbar " collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
				<div className=" h-10 text-white flex items-center ml-5"></div>
				<Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={onClick} />
			</Sider>
			<Layout className="site-layout">
				<Header className="header flex items-center w-full justify-between ">
					<div className="flex items-center text-white ">
						<UserOutlined
							onClick={() => {
								navigate('/home');
							}}
							className="mr-5 sm:hidden icon-web"
						/>
						<p className="text-white mb-0 title md:text-xs">WEB ADMIN</p>
					</div>
					<div className="flex items-center text-white mr-5 ">
						<BellOutlined className=" mr-5" />
						<div className="relative button-down p-5 flex justify-center items-center">
							<DownOutlined className="text-white" />
							<ul className="invisible text-white bg-white absolute w-[7rem] top-[3rem] mb-0 shadow-gray-400 rounded-sm">
								<li
									className=" text-[black] text-center leading-10 list_item shadow-lg"
									onClick={handleLogout}
								>
									Log out
								</li>
								{/* <li
									className="text-[black] text-center
									leading-10 list_item  shadow-lg"
									onClick={handleChangePass}
								>
									Change Password
								</li> */}
							</ul>
						</div>
					</div>
				</Header>
				<Content className="mx-4 my-0">
					<div className="md:overflow-y-auto">
						<Outlet />
					</div>
				</Content>
				<Footer className="text-center"></Footer>
			</Layout>
		</Layout>
	);
}
