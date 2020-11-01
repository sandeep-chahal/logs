import { setUser } from "../index";

export const handleLikeClick = (type, id, setLiked, setPost) => {
	setPost((prev) => ({
		...prev,
		likes_counter: prev.likes_counter + (type === "like" ? 1 : -1),
	}));
	setLiked(type === "like" ? true : false);
	fetch(`/api/post/${type}`, {
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
				setPost((prev) => ({
					...prev,
					likes_counter: prev.likes_counter + (type === "like" ? -1 : 1),
				}));
				setLiked(type === "like" ? false : true);
				alert(data.msg);
			}
		});
};

export const handleComment = (id, comment, setComments, setPost, setButton) => {
	setButton(false);
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
