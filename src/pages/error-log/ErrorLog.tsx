import React, { useState, useEffect, useRef } from 'react';
import { getError } from '../../service/user/UserService';

const ErrorLog = () => {
	const [errHtml, setHtml] = useState<any>([]);

	const divRef = useRef(null) as any;
	const getDataError = async () => {
		try {
			const res = await getError();
			setHtml(res.data.data);
		} catch (error) { }
	};

	useEffect(() => {
		divRef?.current.scrollIntoView({ behavior: 'smooth', block: "end" });
		getDataError();
	}, []);

	return (
		<div>

			<h1 className="text-[1.2rem] font-bold mb-4  ">ERROR VIEW</h1>

			<div className='w-full h-full max-h-[90vh] 2xl:max-h-[85vh] border border-[#999] rounded-md overflow-y-auto'>

				<div ref={divRef} className="p-4 ">
					{errHtml.map((item: any, index: number) => <p key={index}>{item.replace('^', '==============================================================================================')}</p>)}
				</div>

			</div>
		</div>
	);
};

export default ErrorLog;
