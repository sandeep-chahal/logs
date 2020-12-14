import { formatErrors, setUser } from "../index";
import NProgress from "nprogress";

export const getLatest = async () => {
	const res = await fetch("/api/post/latest");
	const data = await res.json();
	if (data.error) throw new Error("Something went wrong");
	return data.data;
};

export const handleLikeUnlike = async (like, id) => {
	try {
		const res = await fetch(`/api/post/${like ? "like" : "unlike"}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				_id: id,
			}),
		});
		const result = await res.json(0);
		if (result.errors) {
			result.msg = result.errors.reduce((msg, err) => err.msg + "\n", "");
		}
		return result;
	} catch (err) {
		return {
			error: true,
			msg: "Something went wrong.",
		};
	}
};

export const handleComment = (id, comment, setComments, setPost, setButton) => {
	setButton(false);
	NProgress.start();
	fetch(`/api/post/comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			_id: id,
			content: comment,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			setButton(true);

			if (data.error) {
				if (data.code === 0) {
					setUser(null);
					alert("Please Login again!");
					window.location.reload();
				} else {
					alert(data.msg);
				}
				console.log(data);
			} else {
				setPost((prev) => ({
					...prev,
					comments_counter: prev.comments_counter + 1,
				}));

				setComments((prev) => {
					return [data.data, ...prev];
				});
			}
		})
		.finally(() => {
			NProgress.done();
		});
};
export const handleDeleteComment = (
	id,
	setBntDisable,
	setComments,
	setPost
) => {
	setBntDisable(true);
	fetch(`/api/post/deleteComment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			_id: id,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.error) {
				if (data.code === 0) {
					setUser(null);
					alert("Please Login again!");
					window.location.reload();
				} else {
					alert(data.msg);
					setBntDisable(false);
				}
				console.log(data);
			} else {
				setComments((prev) => prev.filter((comment) => comment._id !== id));
				setPost((prev) => ({
					...prev,
					comments_counter: prev.comments_counter - 1,
				}));
			}
		});
};

export const loadMoreComments = (
	id,
	comLen,
	setLoadMore,
	setMoreError,
	setComments
) => {
	setLoadMore(true);
	fetch("/api/post/moreComments", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			_id: id,
			skip: comLen,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.error) {
				alert(data.msg);
				setMoreError(data.msg ? data.msg : "Something went wrong");
			} else {
				setComments((prev) => [...prev, ...data.data]);
				setLoadMore(false);
			}
		})
		.catch((err) => {
			console.log(err);
			setMoreError("Something went wrong");
			setLoadMore(false);
		});
};

// export const addPost = async (headerImg, title, tags, markdown) => {
// 	try {
// 		let result = await fetch("/api/post/add", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				headerImg,
// 				title,
// 				tags,
// 				markdown,
// 			}),
// 		});
// 		result = result.json();
// 		console.log(result);
// 		return result;
// 	} catch (err) {
// 		console.log(err);
// 		return {
// 			error: true,
// 			msg: err.message,
// 		};
// 	}
// };

export const modifyPost = async (
	edit,
	postId,
	headerImg,
	title,
	tags,
	markdown
) => {
	try {
		const data = {};
		if (edit) data._id = postId;
		if (headerImg) data.header_img = headerImg;
		if (title) data.title = title;
		if (tags) data.tags = tags;
		if (markdown) data.markdown = markdown;
		let result = await fetch(edit ? `/api/post/edit` : "/api/post/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		result = result.json();
		console.log(result);
		return result;
	} catch (err) {
		console.log(err);
		return {
			error: true,
			msg: err.message,
		};
	}
};

export const deletePost = async (id) => {
	try {
		const res = await fetch("/api/post/delete", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				_id: id,
			}),
		});
		const data = await res.json();
		return data;
	} catch (err) {
		console.log(err);
		return {
			error: true,
			code: 106,
			msg: "Something Went Wrong",
		};
	}
};

export const loadMorePostsByUser = async (id, skip) => {
	try {
		const res = await fetch("/api/user/posts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				_id: id,
				skip,
			}),
		});
		const data = await res.json();
		return data;
	} catch {
		return {
			error: true,
			code: 106,
		};
	}
};
