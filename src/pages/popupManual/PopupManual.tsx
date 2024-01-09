import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Spin, Button, message } from 'antd';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { saveManualPage } from '../../service/auth/AuthService';

export default function PopupManual(props: any) {
	const { isModalVisible, handleCancel, handleOK, dataItemManual } = props;
	const [formManual] = Form.useForm();
	const [statusButton, setStatusButton] = useState(false);
	const [isSpin, setIsSpin] = useState(false);
	const [content, setContent] = useState<string>(dataItemManual?.content);
	const onFinish = async (values: any) => {
		const params = {
			id: dataItemManual?.id,
			name: formManual.getFieldsValue().name,
			url: formManual.getFieldsValue().url,
			content: content ? content : dataItemManual?.content,
		};
		try {
			const res = await saveManualPage(params);
			if (res) {
				message.success(res?.data?.message);
				formManual.resetFields();
				handleOK();
			}
		} catch (error) {
			console.log(error);
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};

	const handleChangeContent = (content: any) => {
		const value = formManual.getFieldsValue();
		if (value.name === '' || value.url === '' || content === '<p><br></p>' || content === undefined) {
			setStatusButton(true);
		} else {
			setStatusButton(false);
		}
		setContent(content);
	};

	const onChange = (e: any) => {
		const value = formManual.getFieldsValue();
		if (value.name === '' || value.url === '' || content === '<p><br></p>' || content === undefined) {
			setStatusButton(true);
		} else {
			setStatusButton(false);
		}
	};
	const handleCancelModal = () => {
		formManual.setFieldsValue({
			name: dataItemManual?.name,
			url: dataItemManual?.url,
		});
		handleCancel();
	};
	useEffect(() => {
		formManual.setFieldsValue({ name: dataItemManual?.name, url: dataItemManual?.url });
	}, [dataItemManual, formManual]);
	return (
		<div>
			<Spin size="small" spinning={isSpin} delay={1000}>
				<Modal
					destroyOnClose={true}
					visible={isModalVisible}
					onCancel={handleCancelModal}
					onOk={handleOK}
					className="round-sm text-center"
					centered
					footer={null}
					width="100%"
				>
					<h1 className="mb-8">
						Edit Form Manuals :{' '}
						<span className="ml-2" style={{ color: 'red' }}>{`${dataItemManual?.id}`}</span>
					</h1>
					<Form
						name="basic"
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						autoComplete="off"
						className="w-full"
						form={formManual}
					>
						<div className="flex w-full justify-between mb-4">
							<h2 className="mr-2 w-[10%] text-right ">Title :</h2>
							<div className="w-[90%]">
								<Form.Item
									name="name"
									rules={[{ required: true, message: 'Please input your title!' }]}
								>
									<Input onChange={e => onChange(e)} />
								</Form.Item>
							</div>
						</div>
						<div className="flex w-full justify-between mb-4">
							<h2 className="mr-2 w-[10%] text-right ">URL :</h2>
							<div className="w-[90%]">
								<Form.Item name="url" rules={[{ required: true, message: 'Please input your title!' }]}>
									<Input onChange={e => onChange(e)} />
								</Form.Item>
							</div>
						</div>
						<div className="flex w-full justify-between mb-4">
							<h2 className="mr-2 w-[10%] text-right ">Description :</h2>
							<div className="w-[90%] h-full">
								<SunEditor
									autoFocus={true}
									width="100%"
									height="400"
									onChange={handleChangeContent}
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
									// defaultValue={dataItemManual?.content}
									setContents={dataItemManual?.content}
								/>
							</div>
						</div>
						<Form.Item wrapperCol={{ offset: 32, span: 32 }}>
							<div className="w-[200px] mx-auto text-lg ">
								<Button
									disabled={statusButton}
									className="w-full !text-base !h-9 !rounded-md"
									type="primary"
									htmlType="submit"
								>
									Save
								</Button>
							</div>
						</Form.Item>
					</Form>
				</Modal>
			</Spin>
		</div>
	);
}
function getDataAllManualPage() {
	throw new Error('Function not implemented.');
}
