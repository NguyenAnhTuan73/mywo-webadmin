import { Button, Form, Input, Modal, message } from 'antd'
import React, { useEffect, useState } from 'react'
import SunEditor from 'suneditor-react';
import { getPosts, addPost } from '../../service/auth/AuthService';

export const PopupPostAdd = (props: any) => {
    const { isModalOpen, handleCancel, handleOk, setPost, data} = props;
    const [formSendUSer] = Form.useForm();
    const [content, setContent] = useState<string>();
    const [statusButton, setStatusButton] = useState(true);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };


    const onFinish = async (values: any) => {
        const dataSend = {
            title: formSendUSer.getFieldsValue().title,
            html: content ? content : '',
        }
        try {
            const resSave = await addPost(dataSend)
            message.success(resSave.data.message)
            const res = await getPosts();
            setPost(res.data.results)
        } catch (error) {
            message.error('Error!!!')
        }

        formSendUSer.resetFields();
        setStatusButton(true);
        setContent('');
        handleOk()

    };
    const onChange = (content: any) => {
        const value = formSendUSer.getFieldsValue()
        if (value.title === ""  || value.title === undefined || content === '<p><br></p>' || content === undefined  ) {
            setStatusButton(true)
        } else {
            setStatusButton(false)
        }
    };
    const handleChange = (content: string) => {
        setContent(content);
        onChange(content)
    };

    return (
        <>
            <Modal title="CREATE POST" visible={isModalOpen}
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
                            setContents={content}
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
