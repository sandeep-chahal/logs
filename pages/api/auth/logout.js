import withPassport from "../../../config/withPassport";

export default withPassport((req, res) => {
	req.logout();
	res.redirect("/");
});
