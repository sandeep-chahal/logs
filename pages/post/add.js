import { useState } from "react";
import withMiddlewares from "../../middlewares/withMiddlewares";
import withPassport from "../../middlewares/withPassport";

const Add = () => {
	const [headerImg, setHeaderImg] = useState(null);

	const handleFileChange = (e) => {
		setHeaderImg(e.target.files[0]);
	};

	return (
		<section className="p-6 px-20">
			<div className="bg-white p-4">
				{/* header image */}
				<div className="flex items-start">
					<label htmlFor="header-img" className="bg-pureWhite py-1 px-2">
						Upload Header Image
					</label>
					<input
						onChange={handleFileChange}
						id="header-img"
						type="file"
						hidden
					/>
					{headerImg ? (
						<img src={URL.createObjectURL(headerImg)} className="mt-6 h-64" />
					) : null}
				</div>
			</div>
		</section>
	);
};

export const getServerSideProps = async ({ req, res }) => {
	await withMiddlewares(req, res, [withPassport]);
	if (!req.isAuthenticated()) {
		return res.redirect("/?auth_code=0");
	}
	return {
		props: {},
	};
};

export default Add;
