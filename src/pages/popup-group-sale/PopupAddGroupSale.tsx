import { Button, DatePicker, Input, Modal, Select, message } from 'antd';
import Form from 'antd/es/form';
import type { DatePickerProps } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { addGroupSale } from '../../service/user/UserService';
export const PopupAddGroupSale = (props: any) => {
	const dateFormat = 'DD-MM-YYYY HH:mm:ss';
	const { isModalOpen, handleCancelModalAdd, handleOkAddGroupSale, getDataListGroupSale } = props;
	const [formAdd] = Form.useForm();
	const [isOpen, setIsOpen] = useState(true);
	const Option = Select.Option;
	const handleCancel = () => {
		formAdd.resetFields();
		handleCancelModalAdd();
	};
	const onFinish = async () => {
		let values = formAdd.getFieldsValue();
		values = {
			...values,
			amount: +values.amount,
			deposit_amount: +values.deposit_amount,
			deposit_time: +values.deposit_time,
			purchase_time: +values.purchase_time,
			start_amount: +values.start_amount,
			bonus: +values.bonus,
			start: moment(values.start).format('YYYY-MM-DD HH:mm:ss'),
		};

		try {
			const res = await addGroupSale(values);
			message.success(res.data.message);
			getDataListGroupSale();
		} catch (error) {
			message.error('Error');
		}
		formAdd.resetFields();
		handleOkAddGroupSale();
	};
	const onValueChange = () => {
		let values = formAdd.getFieldsValue();
		values = { ...values, start: moment(values.start).format('DD-MM-YYYY HH:mm:ss') };

		if (
			!values.amount ||
			!values.deposit_amount ||
			!values.deposit_time ||
			!values.purchase_time ||
			!values.start_amount ||
			!values.bonus
		) {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	};

	const onChange: DatePickerProps['onChange'] = (date, dateString) => {
		console.log(date, dateString);
	};
	useEffect(() => {
		formAdd.setFieldsValue({
			status: 'new',
			start: moment(),
		});
	}, [isModalOpen]);
	return (
		<div>
			<Modal
				forceRender
				visible={isModalOpen}
				destroyOnClose={true}
				onCancel={handleCancel}
				footer={null}
				title={<div>ADD NEW GROUP SALE </div>}
			>
				<Form form={formAdd} onFinish={onFinish} layout="vertical">
					<Form.Item label={<span className="font-semibold">Deposit Amount</span>} name="deposit_amount">
						<Input type="number" min={0} onChange={onValueChange} />
					</Form.Item>
					<Form.Item label={<span className="font-semibold">Deposit Time</span>} name="deposit_time">
						<Input type="number" min={0} onChange={onValueChange} />
					</Form.Item>
					<Form.Item label={<span className="font-semibold">Purchase Time</span>} name="purchase_time">
						<Input type="number" min={0} onChange={onValueChange} />
					</Form.Item>
					<Form.Item label={<span className="font-semibold">Amount</span>} name="amount">
						<Input type="number" min={0} onChange={onValueChange} />
					</Form.Item>
					<Form.Item label={<span className="font-semibold">Bonus</span>} name="bonus">
						<Input type="number" min={0} onChange={onValueChange} />
					</Form.Item>
					<Form.Item label={<span className="font-semibold">Status</span>} name="status">
						<Select style={{ width: '50%' }} onChange={onValueChange} defaultValue={'new'}>
							<Option value="new">New</Option>
							<Option value="ended">Ended</Option>
						</Select>
					</Form.Item>
					<Form.Item label={<span className="font-semibold">Start</span>} name="start">
						<DatePicker showTime format={dateFormat} className="w-1/2" onChange={onChange} />
					</Form.Item>
					<Form.Item label={<span className="font-semibold">Start Amount</span>} name="start_amount">
						<Input type="number" min={0} onChange={onValueChange} />
					</Form.Item>
					<Form.Item>
						<div className="flex justify-center mt-5">
							<Button disabled={isOpen} className="w-[10rem]" type="primary" htmlType="submit">
								Save
							</Button>
						</div>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};
