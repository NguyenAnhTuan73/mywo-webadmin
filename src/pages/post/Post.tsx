import React, { useEffect, useState } from 'react'
import { Button, Table } from 'antd'
import { PopupPostAdd } from '../popup-post/PopupPostAdd';
import { getPosts } from '../../service/auth/AuthService';
import { TypeEmailTemplate } from '../../interface/manage.interface';
import { PopupPostEdit } from '../popup-post/PopupPostEdit';
import { ColumnsType } from 'antd/lib/table';
import { DataType } from '../../interface/list-user/list_user.interface';

export const Post = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState<any>();
    
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleOkEdit = () => {
        setIsModalOpenEdit(false);
    };

    const handleCancelEdit = () => {
        setIsModalOpenEdit(false);
    };

    const getPosts = async () => {
        try {
            const res = await getPosts();
            // setPosts(res.data.results);
            
        } catch (error) {
            console.log("🚀 ~ file: EmailTemplate.tsx:26 ~ getDataEmailTemplate ~ error:", error)

        }
    }
    // Edit
    const handleClickEdit = (item: TypeEmailTemplate) => {
        setPost(post);
        setIsModalOpenEdit(true);
    }

    useEffect(() => {
        getPosts()
    }, [])


    const columns:ColumnsType<DataType> = [
        {
            title: 'No.',
            dataIndex: 'index',
            key: 'index',
            width: '3%',
            className:'text-center',
            fixed: 'left',
            render: (text: string, object: object, index: number) => index + 1
        },
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'TITLE',
            dataIndex: 'title',
            key: 'index',
        },
        {
            title: 'DESCRIPTION',
            dataIndex: 'html',
            key: 'html',
            // width: '5%',
            render: (_: any) => {
                return (
                    <>
                        <div dangerouslySetInnerHTML={{__html: _}}>
                        </div>
                    </>
                );
            },
        },
        {
            title: 'EDIT',
            key: 'edit',
            dataIndex: 'edit',
            width: '9%',
            render: (_: any, item: any) => {
                return (
                    <>
                        <Button type="primary" danger size="small" className='!rounded-sm ' onClick={() => handleClickEdit(item)} >
                            <div className=' flex items-center px-1 '>
                                <i className='bx bx-edit'></i>
                                <span className='ml-1'>Edit</span>
                            </div>
                        </Button>
                    </>
                );
            },
        }

    ]

    return (
        <div className='bg-white rounded-md p-10 sm:p-1 my-4'>
            <h1 className='font-semibold text-base'>POSTS</h1>
            <div className='w-full text-end'>
                <Button type='primary' className=' text-white  !rounded-sm shadow-md'
                    onClick={showModal}>
                    <div className='flex items-center'>
                        <i className='bx bx-plus'></i>
                        <span className='ml-1'>Create New Post</span>
                    </div>
                </Button>
            </div>
            <div className='mt-4'>
                <Table bordered columns={columns} dataSource={posts}
                    pagination={{
                        pageSizeOptions: ["10", "20", "30"],
                        showSizeChanger: true
                    }} />
            </div>
            <PopupPostAdd
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                setDataEmailTemplate={setPost}
            />
            <PopupPostEdit
                isModalOpen={isModalOpenEdit}
                handleOk={handleOkEdit}
                handleCancel={handleCancelEdit}
                dataItem={post}
                setDataEmailTemplate={setPost}
            />
        </div>
    )
}
