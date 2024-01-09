import React, { useState } from 'react';
import {  Modal, Form, Input,  Spin } from 'antd';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

const PopupManualAddNews = (props: any) => {
	const { isModalNewsManuals, handleCancelAddManutals, handleOkAddManuals } = props;
	const [isSpin, setIsSpin] = useState(false);

	const [title, setTitle] = useState<string>();
	const [url, setUrl] = useState<string>();
	const [content, setContent] = useState<string>();

	const setNewTitle = (value: string) => {
		setTitle(value);
		setUrl(
			value
				.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
				.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
				.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
				.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
				.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
				.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
				.replace(/đ/g, 'd')
				.replace(/([a-z])([A-Z])/g, '$1-$2')
				.replace(/[\s_]+/g, '-')
				.toLowerCase(),
		);
	};
	const setNewsUrl = (value: string) => {
		setUrl(
			value
				.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
				.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
				.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
				.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
				.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
				.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
				.replace(/đ/g, 'd')
				.replace(/([a-z])([A-Z])/g, '$1-$2')
				.replace(/[\s_]+/g, '-')
				.toLowerCase(),
		);
	};
	const setNewContent = (value: string) => {
		setContent(value);
	};
	const onSave = () => {
		const data = {
			name: title,
			url,
			content,
		};
		handleOkAddManuals(data);
		setTitle('');
		setUrl('');
		setContent('');
	};

	const onFinish = (values: any) => {
		console.log('Success:', values);
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log('Failed:', errorInfo);
	};
	
	const { TextArea } = Input;
	// check
	const handleChange = (content: string) => {
		setContent(content);
	};
	return (
		<div>
			<Spin size="small" spinning={isSpin} delay={1000}>
				<Modal
					destroyOnClose={true}
					visible={isModalNewsManuals}
					onCancel={handleCancelAddManutals}
					onOk={onSave}
					className="round-sm text-center"
					centered
					okText="Save"
					width="100%"
				>
					<h1 className="mb-8">News Manuals :</h1>
					<Form
						name="basic"
						// labelCol={{ span: 4 }}
						// wrapperCol={{ span: 12 }}
						initialValues={{ remember: true }}
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						autoComplete="off"
						className="w-full"
					>
						<div className="flex w-full justify-between mb-4">
							<h2 className="mr-2 w-[10%] text-right ">Title :</h2>
							<div className="w-[90%]">
								<Input value={title} onChange={e => setNewTitle(e.target.value)} />
							</div>
						</div>
						<div className="flex w-full justify-between mb-4">
							<h2 className="mr-2 w-[10%] text-right ">URL :</h2>
							<div className="w-[90%]">
								<Input value={url} onChange={e => setNewsUrl(e.target.value)} />
							</div>
						</div>
						<div className="flex w-full justify-between mb-4">
							<h2 className="mr-2 w-[10%] text-right ">Description :</h2>
							<div className="w-[90%] h-full">
								<SunEditor
									autoFocus={true}
									width="100%"
									height="400"
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
						</div>
					</Form>
				</Modal>
			</Spin>
		</div>
	);
};

export default PopupManualAddNews;
