import React, { useState } from 'react';
import { Button, message, Modal, Spin } from 'antd';
import '../popup-logout/PopupLogout.scss';
import { activeUser } from '../../service/user/UserService';

export default function PopupChangeStatusUser(props: any) {
    const { ModalVisible, handleCancel, handleOK, isModalOpen, statusActiveUser } = props;
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
                    title="STATUS USER"
                >
                    {statusActiveUser === 'active' ? (
                        <p className="text-center text-red-600 text-[1.2rem]">
                            Do you want to deactivate this account?
                        </p>
                    ) : (
                        <p className="text-center text-red-600 text-[1.2rem]">Do you want to activate this account?</p>
                    )}

                </Modal>
            </Spin>
        </div>
    );
}
