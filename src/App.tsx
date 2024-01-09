import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import './assets/libs/boxicons-2.1.1/css/boxicons.min.css';
import 'antd/dist/antd.min.css'; // or 'antd/dist/antd.less'
import Authenticate from './pages/authenticate/Authenticate';
import Register from './pages/register/Register';
import ResetPass from './pages/reset/ResetPass';
import MainLayout from './layouts/MainLayout';
import ListDevices from './pages/list-devices/ListDevices';
import ChangePassword from './pages/change-password/ChangePassword';
import NotFountPage from './pages/404';
import PrivateRoute from './routes/PrivateRoute';
import DashBoard from './pages/dashboard/DashBoard';
import './App.css';

import ListUser from './pages/list-user/ListUser';

import ListGroup from './pages/list-group/ListGroup';

function App() {
	const [isOnline, setIsOnline] = useState(navigator.onLine);
	useEffect(() => {
		const handleOnlineStatusChange = () => {
			setIsOnline(navigator.onLine);
		};

		window.addEventListener('online', handleOnlineStatusChange);
		window.addEventListener('offline', handleOnlineStatusChange);

		return () => {
			window.removeEventListener('online', handleOnlineStatusChange);
			window.removeEventListener('offline', handleOnlineStatusChange);
		};
	}, []);
	return (
		<div>
			{isOnline ? (
				<BrowserRouter>
					<Routes>
						<Route index element={<Navigate to="/dashboard" />} />
						<Route path="/authenticate" element={<Authenticate />} />
						<Route path="/register" element={<Register />} />
						<Route path="/reset-password" element={<ResetPass />} />
						<Route
							path="/change-password"
							element={
								<PrivateRoute>
									<ChangePassword />
								</PrivateRoute>
							}
						/>
						<Route
							path="/"
							element={
								<PrivateRoute>
									<MainLayout />
								</PrivateRoute>
							}
						>
							<Route path="dashboard" element={<DashBoard />} />
							<Route path="user-list" element={<ListUser />} />
							<Route path="group-list" element={<ListGroup />} />
							<Route path="devices-list" element={<ListDevices />} />
						</Route>
						<Route path="/*" element={<NotFountPage />} />
					</Routes>
				</BrowserRouter>
			) : (
				<>
					<div className="w-screen h-screen">
						<div className="flex justify-center flex-col h-1/2 items-center my-10">
							<i className="bx bx-wifi-off text-black text-3xl"></i>
							<p className="text-2xl text-black text-center mt-4 min-w-[300px] w-full">
								Please check your internet connection and try again.
							</p>
							<button
								onClick={() => window.location.reload()}
								className="border-sideMenu py-2 px-4 border mt-10 rounded-md  font-semibold bg-clMain text-white"
							>
								Try Again{' '}
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default App;
