import React, { useEffect, useState, } from 'react';
import { Button, Form, Input, message, Checkbox, Select } from 'antd';
import { getSelectToFilter, sendToUser } from '../../service/user/UserService';
import _ from 'lodash';
import SunEditor from 'suneditor-react';
import { TypeStatus } from '../../interface/manage.interface';
import moment from 'moment';

export default function SendMessage() {
	const [formSendUSer] = Form.useForm();
	const [content, setContent] = useState<string>();
	const [objParams, setObjParams] = useState({
		search: '',
		page: 1,
		size: 10,
		status: '',
	});
	const [statusButton, setStatusButton] = useState(true);
	const [objOptionSelect, setObjOptionSelect] = useState<any>({});
	const [blockCheckboxFields, setBlockCheckboxFields] = useState({
		user: true,
		deviceID: true,
		deviceModal: true,
		appVersion: true,
		createdDate: true,
		currency: true,
		language: true,
		osVersion: true,
	});
	const paramSend = [
		'device_id',
		'device_model',
		'app_version',
		'created_date',
		'currency',
		'language',
		'os_version'

	];
	const getDataSelect = async () => {
		try {
			const res = await getSelectToFilter(paramSend);
			setObjOptionSelect(res.data.results);
		} catch (error) {
			console.log(error)
		}
	}
	useEffect(() => {
		getDataSelect();
	}, []);

	const onFinish = async (values: any) => {
		const objSend = {
			message: content ? content : '',
			title: values.title,
			isActive: values.user || 0,
			filters: {
				app_version: values.app_version || '',
			},
		};
		try {

			const res = await sendToUser(objSend);
			message.success(res.data.message);
			formSendUSer.resetFields();
			setBlockCheckboxFields({
				appVersion: true,
				user: true,
				deviceID: true,
				deviceModal: true,
				createdDate: true,
				currency: true,
				language: true,
				osVersion: true,
			});
			setContent('');
		} catch (error) {
			console.log(error);
			// message.success(err.data.message);
		}
		formSendUSer.resetFields();
		setStatusButton(true);

	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const onChange = (e: any) => {
		const values = { ...formSendUSer.getFieldsValue(), message: content }
		if (values.title === "") {
			setStatusButton(true)
		} else if (values.title !== undefined && values.message !== undefined && values.app_version !== undefined) { setStatusButton(false) }
		else { setStatusButton(true) }
	};

	const onSearch = (value: string) => {
		console.log('search:', value);
	};


	const handleChangeAppVersion = (e: any) => {
		if (e.target.checked) {
			setBlockCheckboxFields({
				...blockCheckboxFields,
				appVersion: false,
			});
		} else {
			setBlockCheckboxFields({
				...blockCheckboxFields,
				appVersion: true,

			});
			setStatusButton(true)
			formSendUSer.resetFields(['app_version']);
		}
	};
	const handleChangeDeviceModal = (e: any) => {
		if (e.target.checked) {
			setBlockCheckboxFields({
				...blockCheckboxFields,
				deviceModal: false,
			});
		} else {
			setBlockCheckboxFields({
				...blockCheckboxFields,
				deviceModal: true,

			});
			setStatusButton(true)
			formSendUSer.resetFields(['device_model']);
		}
	};
	const handleChangeCreatedDate = (e: any) => {
        if (e.target.checked) {
            setBlockCheckboxFields({
                ...blockCheckboxFields,
                createdDate: false,
            });
        } else {
            setBlockCheckboxFields({
                ...blockCheckboxFields,
                createdDate: true,
            });
            formSendUSer.resetFields(['created_date']);
        }
    };
	const handleChangeCurrency = (e: any) => {
        if (e.target.checked) {
            setBlockCheckboxFields({
                ...blockCheckboxFields,
                currency: false,
            });
        } else {
            setBlockCheckboxFields({
                ...blockCheckboxFields,
                currency: true,
            });
            formSendUSer.resetFields(['currency']);
        }
    };
	const handleChangeLanguage = (e: any) => {
        if (e.target.checked) {
            setBlockCheckboxFields({
                ...blockCheckboxFields,
                language: false,
            });
        } else {
            setBlockCheckboxFields({
                ...blockCheckboxFields,
                language: true,
            });
            formSendUSer.resetFields(['language']);
        }
    };
	const handleChangeOsVersion = (e: any) => {
        if (e.target.checked) {
            setBlockCheckboxFields({
                ...blockCheckboxFields,
                osVersion: false,
            });
        } else {
            setBlockCheckboxFields({
                ...blockCheckboxFields,
                osVersion: true,
            });
            formSendUSer.resetFields(['os_version']);
        }
    };

	const handleChange = (content: string) => {
		const values = { ...formSendUSer.getFieldsValue(), message: content };
		if (values.title === undefined && values.app_version === undefined) {
			setStatusButton(true)
		}
		setContent(content);
	};
	return (
		<div className="bg-white rounded-md p-10 sm:p-1 my-4 ">
			<h1 className="text-lg">FORM SEND MESSAGE TO USERS</h1>

			<Form
				name="basic"
				labelCol={{ span: 32 }}
				wrapperCol={{ span: 32 }}
				initialValues={{ remember: true }}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
				layout="vertical"
				form={formSendUSer}
			>
				<Form.Item
					label="Title Send To User"
					name="title"
					rules={[{ required: true, message: 'Please input your title!' }]}
				>
					<Input onChange={(e) => onChange(e)} />
				</Form.Item>

				<div className="w-full h-full mb-10">
					<h1 className='mb-2'>Message Send To User</h1>
					<SunEditor
						autoFocus={true}
						width="100%"
						height="400"
						setContents={content}
						onChange={handleChange}
						setDefaultStyle="font-size:14px"
						setOptions={{
							buttonList: [
								['align', 'horizontalRule', 'list', 'lineHeight'],
								[
									'bold',
									'underline',
									'italic',
									'strike',
									'font',
									'fontSize',
									'formatBlock',
									'paragraphStyle',
									'blockquote',
									'table',
									'image',
									'video',
									'audio',
								],
								['undo', 'redo'],
								['link', 'fullScreen', 'codeView', 'preview', 'print', 'save'],
								['fontColor', 'hiliteColor', 'textStyle'],
								['removeFormat'],
								['outdent', 'indent'],
							],
						}}
					/>
				</div>

				<div className='flex items-center'>
					<div className="flex mb-2 mr-4">
						<Checkbox
							checked={!blockCheckboxFields.appVersion}
							className="w-[150px]"
							onChange={e => {
								handleChangeAppVersion(e);
							}}
						>
							App Version
						</Checkbox>
						<Form.Item
							className="mb-0 w-80 h-full"
							name="app_version"
							rules={[
								// { required: true, message: 'Please input your app version!' }
								{
									validator(rule, val) {
										if (!blockCheckboxFields.appVersion) {
											if (val === undefined || val === '' || val === null) {
												return Promise.reject(new Error('Please input your app version!'));
											}
										}
										// else {
										// 	return Promise.reject(new Error(''));
										// }
										return Promise.resolve();
									},
								},
							]}
						>
							<Select
								showSearch
								placeholder="Select a app version"
								optionFilterProp="children"
								onChange={onChange}
								onSearch={onSearch}
								filterOption={(input, option) =>
									(option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
								}
								disabled={blockCheckboxFields.appVersion}
							>
								{objOptionSelect?.app_version?.map((item: string, index: number) => {
									return <Select.Option key={index} value={item}>{item}</Select.Option>;

								})}
							</Select>
						</Form.Item>
					</div>

				</div>
				<div className="flex mb-2">
					<Checkbox
						checked={!blockCheckboxFields.deviceModal}
						className="w-[150px]"
						onChange={e => {
							handleChangeDeviceModal(e);
						}}
					>
						Devices Model
					</Checkbox>
					<Form.Item
						className="mb-0 w-80"
						name="device_model"
						rules={[
							// { required: true, message: 'Please input your device modal!' }
							{
								validator(rule, val) {
									if (!blockCheckboxFields.deviceModal) {
										if (val === undefined || val === '' || val === null) {
											return Promise.reject(new Error('Please input your device modal !'));
										}
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Select
							showSearch
							placeholder="Select a device modal"
							optionFilterProp="children"
							onChange={onChange}
							onSearch={onSearch}
							filterOption={(input, option) =>
								(option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
							className="w-10"
							disabled={blockCheckboxFields.deviceModal}
						>
							{objOptionSelect?.device_model?.map((item: string) => {
								return <Select.Option value={item}>{item}</Select.Option>;
							})}
						</Select>
					</Form.Item>
				</div>

				<div className="flex mb-2">
					<Checkbox
						checked={!blockCheckboxFields.createdDate}
						className="w-[150px]"
						onChange={e => {
							handleChangeCreatedDate(e);
						}}
					>
						Created Date
					</Checkbox>
					<Form.Item
						className="mb-0 w-80"
						name="created_date"
						rules={[
							// { required: true, message: 'Please input your created date!' }
							{
								validator(rule, val) {
									if (!blockCheckboxFields.createdDate) {
										if (val === undefined || val === '' || val === null) {
											return Promise.reject(new Error('Please input your created date!'));
										}
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Select
							showSearch
							placeholder="Select a created date"
							optionFilterProp="children"
							onChange={onChange}
							onSearch={onSearch}
							filterOption={(input, option) =>
								(option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
							disabled={blockCheckboxFields.createdDate}
						>
							{objOptionSelect?.created_date?.map((item: string) => {
								return <Select.Option value={item}>{moment(item).format('HH:mm:ss DD-MM-YYYY')}</Select.Option>;
							})}
						</Select>
					</Form.Item>
				</div>
				<div className="flex mb-2">
					<Checkbox
						checked={!blockCheckboxFields.currency}
						className="w-[150px]"
						onChange={e => {
							handleChangeCurrency(e);
						}}
					>
						Currency
					</Checkbox>
					<Form.Item
						className="mb-0 w-80"
						name="currency"
						rules={[
							// { required: true, message: 'Please input your currency!' }
							{
								validator(rule, val) {
									if (!blockCheckboxFields.currency) {
										if (val === undefined || val === '' || val === null) {
											return Promise.reject(new Error('Please input your currency!'));
										}
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Select
							showSearch
							placeholder="Select a currency"
							optionFilterProp="children"
							onChange={onChange}
							onSearch={onSearch}
							filterOption={(input, option) =>
								(option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
							disabled={blockCheckboxFields.currency}
						>
							{objOptionSelect?.currency?.map((item: string) => {
								return <Select.Option value={item}>{item}</Select.Option>;
							})}
						</Select>
					</Form.Item>
				</div>
				<div className="flex mb-2">
					<Checkbox
						checked={!blockCheckboxFields.language}
						className="w-[150px]"
						onChange={e => {
							handleChangeLanguage(e);
						}}
					>
						Language
					</Checkbox>
					<Form.Item
						className="mb-0 w-80"
						name="language"
						rules={[
							// { required: true, message: 'Please input your language!' }
							{
								validator(rule, val) {
									if (!blockCheckboxFields.language) {
										if (val === undefined || val === '' || val === null) {
											return Promise.reject(new Error('Please input your language!'));
										}
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Select
							showSearch
							placeholder="Select a language"
							optionFilterProp="children"
							onChange={onChange}
							onSearch={onSearch}
							filterOption={(input, option) =>
								(option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
							disabled={blockCheckboxFields.language}
						>
							{objOptionSelect?.language?.map((item: string,) => {
								return <Select.Option value={item}>{item}</Select.Option>;
							})}
						</Select>
					</Form.Item>
				</div>
				<div className="flex mb-2">
					<Checkbox
						checked={!blockCheckboxFields.osVersion}
						className="w-[150px]"
						onChange={e => {
							handleChangeOsVersion(e);
						}}
					>
						Os Version
					</Checkbox>
					<Form.Item
						className="mb-0 w-80"
						name="os_version"
						rules={[
							// { required: true, message: 'Please input your os version!' }
							{
								validator(rule, val) {
									if (!blockCheckboxFields.osVersion) {
										if (val === undefined || val === '' || val === null) {
											return Promise.reject(new Error('Please input your Os Version!'));
										}
									}
									return Promise.resolve();
								},
							},
						]}
					>
						<Select
							showSearch
							placeholder="Select a os version"
							optionFilterProp="children"
							onChange={onChange}
							onSearch={onSearch}
							filterOption={(input, option) =>
								(option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
							}
							disabled={blockCheckboxFields.osVersion}
						>
							{objOptionSelect?.os_version?.map((item: string,) => {
								return <Select.Option value={item}>{item}</Select.Option>;
							})}
						</Select>
					</Form.Item>
				</div>

				<Form.Item wrapperCol={{ offset: 32, span: 32 }}>
					<div className="w-[200px] mx-auto text-lg ">
						<Button disabled={statusButton} className="w-full !text-base !h-9 !rounded-md" type="primary" htmlType="submit">
							Send
						</Button>
					</div>
				</Form.Item>
			</Form>

		</div>
	);
}
