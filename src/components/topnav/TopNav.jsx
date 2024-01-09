import './topnav.scss';

const TopNav = () => {
	const openSidebar = () => {
		document.body.classList.toggle('sidebar-open');
	};

	return (
		<div className="topnav  w-full ">
			{/* <UserInfo user={data.user} /> */}
			<div className="sidebar-toggle " onClick={openSidebar}>
				<i className="bx bx-menu-alt-right sm:text-[2rem]"></i>
			</div>
		</div>
	);
};

export default TopNav;
