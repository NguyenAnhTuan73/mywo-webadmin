import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter, Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { getToken } from '../helper/tokenHelper';
import { configApp } from '../config/config';

export default function PrivateRoute(props: any) {
	const { children } = props;
	return getToken(configApp.refreshTokenKey) ? children : <Navigate to="/authenticate" />;
}
