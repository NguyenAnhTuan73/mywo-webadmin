import React from 'react';
import './main-layout.scss';
import { Outlet } from 'react-router-dom';
import TopNav from '../components/topnav/TopNav';
import Sidebar from '../components/sidebar/Sidebar';

const MainLayout = () => {
	return (
		<>
			<Sidebar />
			<div className="main">
				<div className="main__content">
					<TopNav />
					<Outlet />
				</div>
			</div>
		</>
	);
};

export default MainLayout;
