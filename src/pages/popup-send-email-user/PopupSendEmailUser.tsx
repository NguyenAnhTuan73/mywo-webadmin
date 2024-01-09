import { useState } from 'react';
import { Modal, Radio, Button, Input, Form } from 'antd';
import type { RadioChangeEvent } from 'antd';
import SunEditor from 'suneditor-react/dist/SunEditor';
import 'suneditor/dist/css/suneditor.min.css';


const PopupSendEmailUser = (props: any) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formSendEmail] = Form.useForm();
	const {
		isModalOpenSendEmail,
		setIsModalOpenSendEmail,
		isOpenModalNote,
		setIsOpenModalNote,
		handleCancelShowModalEmailUser,
		setTemplateValue,
		templateValue,
		handleSendEmail,
		setContent,
		title,
		setTitle,
		content,
	} = props;


	const onChange = (e: RadioChangeEvent) => {
		setTemplateValue(e.target.value);
		if (e.target.value === 5089537) {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	};

	const onChangeTitle = (e: any) => {
		const value = formSendEmail.getFieldsValue();

		setTitle(value?.title)
		if (value.title === '' || value.title === undefined || content === '<p><br></p>' || content === undefined) {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	};

	const handleChange = (content: string) => {
        const value = formSendEmail.getFieldsValue()
        if (value.title === "" ||  value.title === undefined || content === '<p><br></p>' || content === undefined  ) {
            setIsOpen(true)
        } else {
            setIsOpen(false)
        }
        setContent(content);
    };
	const handleShowModalNote = () => {
		setIsOpenModalNote(true);
	};
	const handleCancelShowModalNote = () => {
		setIsOpenModalNote(false);
		setIsModalOpenSendEmail(false);
	};
	const onFinish = ()=>{
		handleSendEmail()
		formSendEmail.resetFields();
	}

	const onCancel = () => {
		handleCancelShowModalEmailUser()
		formSendEmail.resetFields();
	}
	const onCancelNote = () => {
		handleCancelShowModalNote()
		formSendEmail.resetFields();
	}


	return (
		<div>
			<Modal
				title="SEND EMAIL"
				destroyOnClose={true}
				visible={isModalOpenSendEmail}
				onCancel={onCancel}
				className="p-2 rounded-sm"
				footer={null}
				width={templateValue === 5089537 ? '50%' : '520px'}
			>
				<Form form={formSendEmail} autoComplete="off"
                    layout="vertical"  >
					<div className="mb-4">
						<Radio.Group
							className="w-full flex items-center justify-between"
							onChange={onChange}
							value={templateValue}
						>
							<Radio value={5056558}>Life time</Radio>
							<Radio value={5074543}>Package </Radio>
							<Radio value={5089537}>Custom </Radio>
						</Radio.Group>
					</div>
					{templateValue === 5089537 ? (
						<div>
							<div className="flex w-full justify-between flex-col mb-4">
								<Form.Item
									label={<p className='m-0 font-semibold'>Title :</p>}
									name="title"
									rules={[{ required: true, message: 'Please input your title!' }]}
								>
									<Input onChange={e => onChangeTitle(e)} />
								</Form.Item>
							</div>
							<div className="flex w-full justify-between flex-col mb-4">
								<h2 className="   ">Description :</h2>
								<div className=" h-full">
									<SunEditor
										autoFocus={true}
										width="100%"
										height="400"
										onChange={handleChange}
										setDefaultStyle="font-size:16px"
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
						</div>
					) : (
						<></>
					)}
					<div className="text-center mt-5">
						<Button
							disabled={isOpen}
							type="primary"
							className="min-w-[10rem]"
							onClick={() => handleShowModalNote()}

						>
							SEND
						</Button>
					</div>
				</Form>
			</Modal>
			{/* Modal Note */}
			<Modal
				title="NOTE"
				destroyOnClose={true}
				visible={isOpenModalNote}
				onCancel={onCancelNote}
				className="p-2 rounded-sm"
				footer={null}
			>
				<div className="mb-10">
					<p className=" mb-0 text-md italic text-red-600">*Are you sure send to emails for users?</p>
				</div>
				<div className="text-center">
					<Button type="primary" onClick={() => onFinish()} className="min-w-[10rem]">
						OK
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default PopupSendEmailUser;
