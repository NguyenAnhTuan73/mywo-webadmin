import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { getAllManualPage, saveManualPage } from '../../service/auth/AuthService';
import { TypeDataManual } from './tutorials.interface';
import PopupManual from '../popupManual/PopupManual';
import PopupManualAddNews from '../popupManual/PopupManualAddNews';
import { getAccessToken } from '../../helper/tokenHelper';

const Tutorials = () => {
	const [dataManual, setDataManual] = useState<any>(null);
	const [dataItemManual, setDataItemManual] = useState<any>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isModalNewsManuals, setIsModalNewsManuals] = useState(false);

	const [newsUrl, setNewsUrl] = useState('');
	const [total, setTotal] = useState();
	const [newsContent, setNewsContent] = useState<any>('');
	//loading....
	const [spinValues, setSpinValues] = useState(false);
	const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

	const getDataAllManualPage = async () => {
		setSpinValues(true);
		try {
			const res = await getAllManualPage();
			setDataManual(res?.data?.results);
			setTotal(res?.data?.results.length);
			setSpinValues(false);
		} catch (error) {
			console.log('error', error);
			setSpinValues(false);
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};
	const handleCancelAddManutals = () => {
		setIsModalNewsManuals(false);
	};
	const handleOkAddManuals = async (data: { name: string; url: string; content: string }) => {
		const res = await saveManualPage(data);
		message.success('Created news manual successfully');
		setDataManual([res?.data?.results, ...dataManual]);
		getDataAllManualPage();
		setIsModalNewsManuals(false);
	};

	const handleOk = async () => {
		getDataAllManualPage();
		setIsModalVisible(false);
	};

	const renderDataManuals = dataManual?.map((item: TypeDataManual, index: number) => {
		return {
			index: index + 1,
			id: item._id,
			name: item.name,
			url: item.url,
			content: item.content,
			created_date: item.created_date,
			updated_date: item.updated_date,
		};
	});
	const getDataItemManual = (item: TypeDataManual) => {
		setDataItemManual(item);
		setIsModalVisible(true);
	};
	const addNewsManual = () => {
		setIsModalNewsManuals(true);
	};
	const columns: ColumnsType<TypeDataManual> = [
		{
			title: 'No.',
			dataIndex: 'index',
			key: 'index',
			className: 'text-center',
			width: '3%',
		},

		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'TITLE',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'URL',
			dataIndex: 'url',
			key: 'url',
		},
		// {
		// 	title: 'CREATED DATE',
		// 	dataIndex: 'created_date',
		// 	key: 'created_date',
		// 	className: 'text-center',
		// 	width: '10%',
		// 	render: item => {
		// 		return <div>{`${moment(item).format('DD-MM-YYYY')}`}</div>;
		// 	},
		// },
		// {
		// 	title: 'UPDATED DATE',
		// 	dataIndex: 'updated_date',
		// 	key: 'updated_date',
		// 	className: 'text-center',
		// 	width: '10%',
		// 	render: (item: any) => {
		// 		return <div>{`${moment(item).format('DD-MM-YYYY')}`}</div>;
		// 	},
		// },
		{
			title: 'EDIT',
			dataIndex: 'edit',
			key: 'edit',
			className: 'text-center',
			width: '5%',

			render: (_, item) => {
				return (
					<>
						<Button type="primary" size="small" onClick={() => getDataItemManual(item)}>
							Edit
						</Button>
					</>
				);
			},
		},
	];
	useEffect(() => {
		getDataAllManualPage();
	}, [getAccessToken()]);
	return (
		<>
			<div className=" w-full ">
				<div className="  px-5  w-full">
					<div className="flex justify-between items-center mb-2">
						<h1 className=" text-[1.2rem]  ">TUTORIALS LIST</h1>
						<Button onClick={() => addNewsManual()} type="primary">
							<i className="bx bx-plus"></i>
							Add News Manual
						</Button>
					</div>
					<Table
						bordered
						columns={columns}
						scroll={{ x: 'max-content' }}
						dataSource={renderDataManuals}
						pagination={{
							pageSizeOptions: ['10', '20', '50'],
							showSizeChanger: true,
						}}
						locale={{
							emptyText: (
								<>
									{spinValues ? (
										<Spin indicator={antIcon} spinning={spinValues} />
									) : (
										<span className="italic font-medium  text-center">No data</span>
									)}
								</>
							),
						}}
					/>
				</div>
			</div>
			<PopupManual
				isModalVisible={isModalVisible}
				handleCancel={handleCancel}
				handleOK={handleOk}
				dataItemManual={dataItemManual}
				setDataItemManual={setDataItemManual}
				setNewsContent={setNewsContent}
				setNewsUrl={setNewsUrl}
				newsContent={newsContent}
			/>
			<PopupManualAddNews
				isModalNewsManuals={isModalNewsManuals}
				handleCancelAddManutals={handleCancelAddManutals}
				handleOkAddManuals={handleOkAddManuals}
				setNewsContent={setNewsContent}
			/>
		</>
	);
};

export default Tutorials;
