import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import './assets/libs/boxicons-2.1.1/css/boxicons.min.css';
import 'antd/dist/antd.min.css'; // or 'antd/dist/antd.less'
import Authenticate from './pages/authenticate/Authenticate';
import Register from './pages/register/Register';
import ResetPass from './pages/reset/ResetPass';
import MainLayout from './layouts/MainLayout';

import DetailFamily from './pages/detail-family/DetailFamily';
import ListDevices from './pages/list-devices/ListDevices';
import SendMessage from './pages/send-message/SendMessage';
import ChangePassword from './pages/change-password/ChangePassword';
import NotFountPage from './pages/404';
import PrivateRoute from './routes/PrivateRoute';
import ListFamily from './pages/list-family/ListFamily';
import DashBoard from './pages/dashboard/DashBoard';
import Tutorials from './pages/tutorials/Tutorials';
import PointList from './pages/point-list/PointList';
import { Post } from './pages/post/Post';
import SendEmail from './pages/send-email/SendEmail';
import './App.css';
import ErrorLog from './pages/error-log/ErrorLog';
import ListUser from './pages/list-user/ListUser';
import GroupSale from './pages/group-sale/GroupSale';

function App() {
	return (
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
					<Route path="family-list" element={<ListFamily />} />
					<Route path="family-detail" element={<DetailFamily />} />
					<Route path="devices-list" element={<ListDevices />} />
					<Route path="send-message" element={<SendMessage />} />
					<Route path="send-email" element={<SendEmail />} />
					<Route path="post" element={<Post />} />
					<Route path="tutorials" element={<Tutorials />} />
					<Route path="point-list" element={<PointList />} />
					<Route path="group-sale" element={<GroupSale />} />
					<Route path="error-log" element={<ErrorLog />} />
				</Route>
				<Route path="/*" element={<NotFountPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
