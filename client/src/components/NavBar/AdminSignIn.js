import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
// import loginBg from "../../images/loginBg.svg";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

import { Context } from "../../App";
import AdminSideDrawer from "./AdminSideDrawer";
// import axios from "axios";

const styles = () => ({
	paper: {
		backgroundColor: "transparent",
		// maxWidth: "753px"
	},
	login: {
		display: "flex",
		top: "30%",
		flexDirection: "column",
		padding: "0% 5%",
		textAlign: "center",
		position: "absolute",
		justifyContent: "center",
	},
	signIn: {
		marginBottom: "5%",
	},
	textField: {
		marginTop: "2%",
		marginBottom: "4%",
		fontFamily: "muli",
	},
	customError: {
		color: "red",
		marginBottom: "2%",
	},
	bottom: {},
});

function SignIn(props) {
	const history = useHistory();
	const { state, dispatch } = useContext(Context);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [open, setOpen] = useState(false);
	const [errors, setErrors] = useState({});

	const handleSubmit = () => {
		if (
			!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				email
			)
		) {
			return setErrors({ email: "Invalid Email!" });
		}
		if (password === "") {
			return setErrors({ password: "Invalid Password" });
		} else {
			fetch("/admin-signin", {
				method: "post",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + localStorage.getItem("student_jwt"),
				},
				body: JSON.stringify({
					email,
					password,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					if (data.error) {
						const err = data.error;
						setErrors({ err });
					} else {
						localStorage.setItem("jwt", data.token);
						localStorage.setItem("student", JSON.stringify(data.student));
						dispatch({ type: "STUDENT", payload: data.student });
						setOpen(false);
						history.push("/student-dashboard");
						setEmail("");
						setPassword("");
					}
				})
				.catch((err) => {
					// console.log(err);
					setErrors({ err });
				});
		}
	};
	function handleClickOpen() {
		setOpen(true);
	}

	function handleClose() {
		setOpen(false);
	}

	// console.log(student);
	const { classes } = props;
	return (
		<div style={{ fontStyle: "23px" }}>
			{state ? (
				<AdminSideDrawer />
			) : (
				<Button variant="contained" color="secondary" onClick={handleClickOpen}>
					Sign In
				</Button>
			)}
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				maxWidth="md"
				style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
				classes={{
					paper: classes.paper,
				}}>
				app
				<img
					alt="loginBg"
					src="https://res.cloudinary.com/rweb1/image/upload/v1600243283/Assets/images/loginBg_olbayb.svg"
					style={{ visibility: "initial", width: "580px" }}
				/>
				<div className={classes.login}>
					<Typography variant="h4" color="primary" className={classes.signIn}>
						Admin Log in
					</Typography>
					{/* <form noValidate> */}
					<TextField
						id="email"
						name="email"
						type="email"
						label="Email"
						variant="outlined"
						color="secondary"
						// helperText={!email} //error was defined in the backend
						// error={errors.email ? true : false}
						className={classes.textField}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="off"
						fullWidth
					/>
					<TextField
						id="password"
						name="password"
						type="password"
						label="Password"
						variant="outlined"
						color="secondary"
						helperText={errors.password} //error was defined in the backend
						error={errors.password ? true : false}
						className={classes.textField}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						fullWidth
					/>
					{errors.email && (
						<Typography variant="body2" className={classes.customError}>
							{errors.email}
						</Typography>
					)}
					{errors.password && (
						<Typography variant="body2" className={classes.customError}>
							{errors.password}
						</Typography>
					)}
					{errors.err && (
						<Typography variant="body2" className={classes.customError}>
							{errors.err}
						</Typography>
					)}
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						className={classes.button}
						size="large"
						fullWidth
						onClick={() => handleSubmit()}>
						Login
					</Button>
					<br />
					<br />
					<Typography variant="inherit" color="primary" className={classes.forgot}>
						Forgot <span style={{ color: "#0F7DC2" }}>Password?</span>
					</Typography>
				</div>
			</Dialog>
		</div>
	);
}

export default withStyles(styles)(SignIn);