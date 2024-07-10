import React, { useEffect, useState } from 'react';
import './sidebar.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { images } from '../../constant';
import sidebarNav from '../../config/sidebarNav';
import { deleteAccessToken, deleteRefreshToken, deleteUserAndPasswordLocal, getToken } from '../../helper/tokenHelper';
import PopupLogout from '../../pages/popup-logout/PopupLogout';

const Sidebar = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const location = useLocation();
	const navigate = useNavigate();
	const [isModalVisibleLogout, setIsModalVisibleLogout] = useState(false);

	useEffect(() => {
		const curPath = window.location.pathname.split('/')[1];
		const activeItem = sidebarNav.findIndex(item => item.section === curPath);

		setActiveIndex(curPath.length === 0 ? 0 : activeItem);
	}, [location]);

	const closeSidebar = () => {
		// document.querySelector('.main__content').style.transform = 'scale(1) translateX(0)';
		document.body.classList.add('.main__content-active');

		setTimeout(() => {
			document.body.classList.remove('.main__content-active');
			document.body.classList.remove('sidebar-open');
			// document.querySelector('.main__content').style = '';
		}, 500);
	};

	// popup logout
	const handleCancel = () => {
		setIsModalVisibleLogout(false);
	};
	const handleOK = async () => {
		deleteUserAndPasswordLocal();
		deleteAccessToken();
		deleteRefreshToken();
		navigate('/authenticate');
		setIsModalVisibleLogout(false);
	};
	const handlePopupLogout = () => {
		setIsModalVisibleLogout(true);
	};

	return (
		<>
			<div className="sidebar w-1/3 shadow-xl ">
				<div onClick={() => navigate('/dashboard')} className="sidebar__logo cursor-pointer">
					<div className="flex justify-start items-center w-full lg:w-[100px]">
						<img className="h-10 block pl-[5%] " src={images.logo} alt="" />
						<span className="ml-2 text-white text-2xl font-semibold">MYWO</span>
					</div>
					<div className="sidebar-close hover:text-red-600 duration-300 text-red" onClick={closeSidebar}>
						<i className="bx bx-x"></i>
					</div>
				</div>
				<div className="sidebar__menu mt-5">
					{sidebarNav.map((nav, index) => (
						<Link
							to={nav.link}
							key={`nav-${index}`}
							className={`sidebar__menu__item ${activeIndex === index && 'active'}`}
							onClick={closeSidebar}
						>
							<div className="sidebar__menu__item__icon ">
								<i className={nav.icon}></i>
							</div>
							<div className="sidebar__menu__item__txt ">{nav.text}</div>
						</Link>
					))}
					<div className="sidebar__menu__item logout" onClick={handlePopupLogout}>
						<div className="sidebar__menu__item__icon ">
							<i className="bx bx-log-out"></i>
						</div>
						<div className="sidebar__menu__item__txt ">LOGOUT</div>
					</div>
				</div>
			</div>
			<PopupLogout ModalVisible={isModalVisibleLogout} handleCancel={handleCancel} handleOK={handleOK} />
		</>
	);
};

export default Sidebar;
