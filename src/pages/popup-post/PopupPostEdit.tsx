import { Button, Form, Input, Modal, message } from 'antd'
import React, { useEffect, useState } from 'react'
import SunEditor from 'suneditor-react';
import { getMailTemplate, saveMailTemplate } from '../../service/auth/AuthService';

export const PopupPostEdit = (props: any) => {
    const { isModalOpen, handleCancel, handleOk, dataItem, setDataEmailTemplate } = props;
    const [formSendUSer] = Form.useForm();
    const [content, setContent] = useState<string>(dataItem?.html);
    const [statusButton, setStatusButton] = useState(false);
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onFinish = async (values: any) => {
        const dataSend = {
            id: dataItem?._id,
            title:formSendUSer.getFieldsValue().title,
            html: content ? content : dataItem?.html,
        }
        try {
            const resSave = await saveMailTemplate(dataSend)
            message.success(resSave.data.message)
            const res = await getMailTemplate();
            setDataEmailTemplate(res.data.results)
        } catch (error) {
            message.error('Error!!!')
        }
        formSendUSer.resetFields();
        setStatusButton(true);
        setContent('');
        handleOk()

    };
    const onChange = (e: any) => {
        const value = formSendUSer.getFieldsValue()
        if (value.title === "" || value.title === undefined || content === '<p><br></p>' || content === undefined  ) {
            setStatusButton(true)
        } else {
            setStatusButton(false)
        }
    };
    const handleChange = (content: string) => {
        const value = formSendUSer.getFieldsValue()
        if (value.title === "" ||  value.title === undefined || content === '<p><br></p>' || content === undefined  ) {
            setStatusButton(true)
        } else {
            setStatusButton(false)
        }
        setContent(content);
    };
    useEffect(()=>{
        formSendUSer.setFieldsValue({ title: dataItem?.title  })
    },[formSendUSer, dataItem])

    return (
        <>
            <Modal title="EDIT EMAIL TEMPLATE" visible={isModalOpen}
                onOk={handleOk} onCancel={handleCancel}
                width={'100%'} footer={null} className='!h-screen'>
                <Form
                    name="basic"
                    labelCol={{ span: 32 }}
                    wrapperCol={{ span: 32 }}
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
                        <SunEditor
                            autoFocus={true}
                            width="100%"
                            height="400"
                            onChange={handleChange}
                            setContents={dataItem?.html}
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


                    <Form.Item wrapperCol={{ offset: 32, span: 32 }}>
                        <div className="w-[200px] mx-auto text-lg ">
                            <Button disabled={statusButton} className="w-full !text-base !h-9 !rounded-md" type="primary" htmlType="submit">
                                Save
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
