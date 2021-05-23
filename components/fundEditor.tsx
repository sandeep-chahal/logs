import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { modifyFund } from "../utils/fetch/fund";
import { useRouter } from "next/router";
import NProgress from "nprogress";
import uploadFile from "../utils/fetch/uploadFile";
import dayjs from "dayjs";

import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { IFund } from "../models/fund";

const renderers = {
	code: ({ language = "js", value = "" }) => {
		return (
			<SyntaxHighlighter
				language={language}
				children={value
					.split("\n")
					.filter((g) => g)
					.join("\n")}
			/>
		);
	},
	link: ({ href, children }: { href: string; children: React.ReactNode }) => {
		return (
			<a className="text-blue-600 font-bold" href={href} target="_blank">
				{children}
			</a>
		);
	},
};

type IError = {
	[k: string]: string;
};

interface IProps extends IFund {
	edit: boolean;
}

const FundEditor: React.FC<IProps> = (props) => {
	const [livePreview, setLivePreview] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<IError>({});
	const [title, setTitle] = useState(props.title);
	const [summary, setSummary] = useState(props.summary || "");
	const [img, setImg] = useState(props.img);
	const [uploadedImg, setUploadedImg] = useState("");
	const [totalAmount, setTotalAmount] = useState(props.total);
	const [deadline, setDeadline] = useState(
		props.deadline ? props.deadline.substring(0, 10) : ""
	);
	const router = useRouter();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (uploading || !e?.target?.files) return;
		setUploading(true);
		setError({});
		const file = e.target.files[0];
		e.target.value = "";
		uploadFile(file).then((res) => {
			if (res.errors) {
				setError(res.errors);
			} else if (res.data) {
				setUploadedImg(res.data);
			}
			setUploading(false);
		});
	};

	const handleSubmit = () => {
		if (loading) return;
		NProgress.start();
		setLoading(true);
		setError({});
		modifyFund({
			_id: props._id,
			img,
			title,
			summary,
			total: totalAmount,
			deadline,
		}).then((res: any) => {
			NProgress.done();
			// @ts-ignore
			if (res.error) {
				// @ts-ignore
				// @ts-ignore
				if (res.msg) setError(res.msg);
				// @ts-ignore
				else setError(res.errors);
				setLoading(false);
			} else {
				// @ts-ignore
				router.push("/fund/" + res.data._id);
			}
		});
	};

	const handleCheckBox = () => {
		setLivePreview((prev) => !prev);
	};

	return (
		<section className="md:px-20 md:w-4/5 w-11/12 min-h-screen m-auto">
			<div className="p-4">
				{/* upload image */}
				<div className="flex flex-col md:flex-row md:items-center">
					<label
						htmlFor="upload_img"
						className="bg-white py-1 px-2  border-2  rounded p-2"
					>
						{uploading ? "Uploading" : "Upload an image"}
					</label>
					<input
						onChange={handleFileChange}
						id="upload_img"
						type="file"
						disabled={loading || uploading}
						accept="image/png,image/jpeg,image/webp"
						hidden
					/>
					{uploadedImg ? (
						<span className="ml-5 font-normal mt-3 md:mt-0 break-words">
							{uploadedImg}
						</span>
					) : null}
				</div>
				{/* header image url */}
				<input
					type="text"
					placeholder="Enter url here..."
					className="mt-6 p-2 w-full border-2  rounded"
					onChange={(e) => setImg(e.target.value)}
					value={img}
					disabled={loading}
				/>
				{/* title */}
				<input
					type="text"
					placeholder="Fund Title"
					className="mt-6 p-2 mb-2 w-full border-2  rounded"
					onChange={(e) => setTitle(e.target.value)}
					value={title}
					disabled={loading}
				/>
				<div className="flex justify-between">
					{/* Total Fund Amount Wants To Raise */}
					<input
						type="number"
						max={500000}
						placeholder="Total Amount"
						className="mt-6 p-2 mb-4 w-2/5 border-2  rounded"
						onChange={(e) => setTotalAmount(Number(e.target.value))}
						value={totalAmount}
						disabled={loading}
					/>
					{/* DeadLine */}
					<input
						type="date"
						min={dayjs(new Date()).format("YYYY-MM-DD")}
						placeholder="Deadline"
						className="mt-6 p-2 mb-4 w-2/5 border-2  rounded"
						onChange={(e) => setDeadline(e.target.value)}
						value={deadline}
						disabled={loading}
					/>
				</div>
				{/* markdown */}
				<div className="w-full">
					<textarea
						disabled={loading}
						style={{ minHeight: "16rem" }}
						className="mr-4 p-4 border-2 w-full rounded"
						placeholder="Write fund summary here . . . "
						onChange={(e) => setSummary(e.target.value)}
						value={summary}
					></textarea>
					<div
						className="my-2 font-normal inline-flex items-center "
						onClick={handleCheckBox}
						title="Click to enable/disable live preview"
					>
						<input
							type="checkbox"
							className="form-checkbox mr-3 h-4 w-4 text-green-500"
							checked={livePreview}
						/>
						<span>Live Preview</span>
					</div>
					<ReactMarkdown
						renderers={renderers}
						plugins={[gfm]}
						// @ts-ignore
						style={{ minHeight: "16rem" }}
						className="w-full p-4 markdown border-2 rounded"
						children={
							livePreview
								? summary.replaceAll("\n", "\n\n")
								: "Live preview is disabled"
						}
					/>
				</div>

				<button
					onClick={handleSubmit}
					disabled={loading || uploading}
					className="bg-gradient-1 text-white py-1 px-4 mt-8 m-auto block"
				>
					{!loading ? (props.edit ? "Edit" : "Post it") : "okay, wait!"}
				</button>
				{Array.isArray(error) && error.length > 0 ? (
					<div className="text-center my-8">
						{error.map((err) => (
							<div key={err.msg}>{err.msg}</div>
						))}
					</div>
				) : null}
			</div>
		</section>
	);
};

export default FundEditor;
