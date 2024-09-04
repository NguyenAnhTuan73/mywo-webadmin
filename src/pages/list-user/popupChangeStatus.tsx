import React, { useState } from 'react';
import { Button, message, Modal, Spin } from 'antd';
import '../popup-logout/PopupLogout.scss';
import { activeUser } from '../../service/user/UserService';

export default function PopupChangeStatusUser(props: any) {
    const { ModalVisible, handleCancel, handleOK, isModalOpen, } = props;
    const [isSpin, setIsSpin] = useState(false);

    return (
        <div>
            <Spin size="small" spinning={isSpin} delay={1000}>
                <Modal
                    open={isModalOpen}
                    destroyOnClose={true}
                    visible={ModalVisible}
                    onCancel={handleCancel}
                    onOk={handleOK}

                    okButtonProps={{ style: { backgroundColor: '#13ae81', borderColor: '#13ae81' } }}
                    className="round-sm text-center"
                    centered
                >
                    <p className="text-center ">Are you sure you want to change this user's status?</p>
                    {/* <div className="flex justify-center mt-10">
                        <Button
                            style={{ backgroundColor: '#13ae81', border: '#13ae81', borderRadius: '8px' }}
                            type="primary"
                            size="middle"
                            onClick={() => handleChangeStatusUser()}
                        >
                            Change
                        </Button>
                    </div> */}
                </Modal>
            </Spin>
        </div>
    );
}
