import React, { useState } from 'react';
import {
	Typography,
	Button,
	TextField,
	Paper,
	Slider,
	DialogContentText,
	makeStyles,
	Grid,
	IconButton,
	Select,
	FormControlLabel,
	Checkbox
} from '@material-ui/core';

import CssBaseline from '@material-ui/core/CssBaseline';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './StartGameBox.css';

const useStyles = makeStyles((theme) => ({
	paper: {
		backgroundColor: '#242424',
		color: '#fff',
		padding: theme.spacing(3)
	},
	buttons: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	button: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(1)
	}
}));

function StartGameBox() {
	const classes = useStyles();
	const [ mode, setmode ] = useState(0);

	const handleModeOne = () => {
		setmode(1);
	};

	const handleModeZero = () => {
		setmode(0);
	};

	const handleModeTwo = () => {
		setmode(2);
	};

	const getOptionContent = (mode) => {
		switch (mode) {
			case 0:
				return <StartContent setModeToOne={handleModeOne} setModeToTwo={handleModeTwo} />;
			case 1:
				return <NewJoinGame setModeToZero={handleModeZero} />;
			case 2:
				return <NewCreateGame setModeToZero={handleModeZero} />;
			default:
				throw new Error('?? what happened ...');
		}
	};

	return (
		<div>
			<Paper className={classes.paper} elevation={3} style={{ backgroundColor: '#242424', color: '#fff' }}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Typography component="h3" variant="h5" align="center" style={{ color: 'white' }}>
							It's time to begin Commander.
						</Typography>
					</Grid>
					{getOptionContent(mode)}
				</Grid>
			</Paper>
		</div>
	);
}

const StartContent = ({ setModeToOne, setModeToTwo }) => {
	return (
		<React.Fragment>
			<Grid item xs={12} sm={6}>
				<div
					style={{
						marginLeft: '10%',
						marginRight: '10%',
						marginTop: '10%',
						marginBottom: '10%',
						textAlign: 'center',
						fontSize: '50',
						color: '#fff'
					}}
				>
					<IconButton aria-label="newgame" color="primary" size="medium" onClick={setModeToTwo}>
						<AddCircleIcon
							style={{
								fontSize: '50'
							}}
						/>
					</IconButton>
					<Typography variant="subtitle2" style={{ color: 'white' }}>
						Create New Game
					</Typography>
				</div>
			</Grid>
			<Grid item xs={12} sm={6}>
				<div
					style={{
						marginLeft: '10%',
						marginRight: '10%',
						marginTop: '10%',
						marginBottom: '10%',
						textAlign: 'center'
					}}
				>
					<IconButton aria-label="joingame" color="secondary" size="medium" onClick={setModeToOne}>
						<DoubleArrowIcon
							style={{
								fontSize: '50'
							}}
						/>
					</IconButton>
					<Typography variant="subtitle2" style={{ color: 'white' }}>
						Join Game
					</Typography>
				</div>
			</Grid>
		</React.Fragment>
	);
};

const NewJoinGame = ({ setModeToZero }) => {
	return (
		<Grid items xs={12}>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.5.7/dist/css/uikit.min.css" />
			<Paper className="gamebox-wrapper">
				<form action={window.location.toString().replace(":3000", "").replace("play", "join")} method="POST">
					<legend class="uk-legend">Join a game</legend>
					<div class="uk-margin">
						<label class="uk-form-label">Username</label>
						<div class="uk-form-controls">
							<div class="uk-inline">
								<span class="uk-form-icon" uk-icon="icon: user" />
								<input class="uk-input" type="text" placeholder="Username" name="username" required />
							</div>
						</div>
					</div>

					<div class="uk-margin">
						<label class="uk-form-label">Password</label>
						<div class="uk-form-controls">
							<div class="uk-inline">
								<span class="uk-form-icon uk-form-icon-flip " uk-icon="icon: lock" />
								<input class="uk-input" type="password" name="password" required />
							</div>
						</div>
					</div>
					<div class="uk-margin">
						<label class="uk-form-label">Game ID</label>
						<div class="uk-form-controls">
							<div class="uk-inline">
								<span class="uk-form-icon uk-form-icon-flip " uk-icon="icon: hashtag" />
								<input class="uk-input" type="text" placeholder="000000" name="id" />
							</div>
						</div>
					</div>
					<div class="uk-margin">
						<Button type="submit" name="submit" value="join" variant="outlined" color="secondary">
							Join Game
						</Button>
					</div>
				</form>
			</Paper>
			<IconButton aria-label="return" color="secondary" onClick={setModeToZero}>
				<ArrowBackIcon
					style={{
						fontSize: '50'
					}}
				/>
				<Typography variant="subtitle1" style={{ color: 'white' }}>
					Back
				</Typography>
			</IconButton>
		</Grid>
	);
};

const JoinGame = ({ setModeToZero }) => {
	return (
		<Grid items xs={12}>
			<DialogContentText style={{ color: 'white' }}>Join a world war and save the day.</DialogContentText>
			<Paper className="gamebox-wrapper">
				<form action={window.location.toString().replace(":3000", "").replace("play", "join")} method="POST">
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField type="text" id="ign" placeholder="Username" name="username" required />
						</Grid>
						<Grid item xs={12}>
							<TextField type="password" placeholder="Password" name="password" required />
						</Grid>
						<Grid item xs={12}>
							<TextField type="text" placeholder="Game Id" name="id" required />
						</Grid>
						<Grid item xs={12}>
							<Button type="submit" name="submit" value="join" variant="outlined" color="secondary">
								Join Game
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
			<IconButton aria-label="return" color="secondary" onClick={setModeToZero}>
				<ArrowBackIcon
					style={{
						fontSize: '50'
					}}
				/>
				<Typography variant="subtitle1" style={{ color: 'white' }}>
					Back
				</Typography>
			</IconButton>
		</Grid>
	);
};

const NewCreateGame = ({ setModeToZero }) => {
	return (
		<Grid items xs={12}>
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.5.7/dist/css/uikit.min.css" />
			<Paper className="gamebox-wrapper">
				<form action={window.location.toString().replace(":3000", "").replace("play", "create")} method="POST">
					<legend class="uk-legend">Create a game</legend>
					<div class="uk-margin">
						<label class="uk-form-label">Gamemode</label>
						<div class="uk-form-controls">
							<div uk-form-custom="target: > * > span:first-child">
								<select name="type" required>
									<option value="">Please select...</option>
									<option value="realtime">Regular</option>
									<option value="campaign">Campaign</option>
									<option value="capital">Capital Supremacy</option>
								</select>
								<button class="uk-button uk-button-default" type="button" tabindex="-1">
									<span />
									<span uk-icon="icon: chevron-down" />
								</button>
							</div>
						</div>
					</div>

					<div class="uk-margin">
						<label class="uk-form-label">Game Map</label>
						<div class="uk-form-controls">
							<div uk-form-custom="target: > * > span:first-child">
								<select name="situation" required>
									<option value="">Please select...</option>
									<option value="world">World</option>
								</select>
								<button class="uk-button uk-button-default" type="button" tabindex="-1">
									<span />
									<span uk-icon="icon: chevron-down" />
								</button>
							</div>
						</div>
					</div>

					<div class="uk-margin">
						<label class="uk-form-label">Username</label>
						<div class="uk-form-controls">
							<div class="uk-inline">
								<span class="uk-form-icon" uk-icon="icon: user" />
								<input class="uk-input" type="text" placeholder="Username" name="username" required />
							</div>
						</div>
					</div>
					<div class="uk-margin">
						<label class="uk-form-label">Password</label>
						<div class="uk-form-controls">
							<div class="uk-inline">
								<span class="uk-form-icon uk-form-icon-flip " uk-icon="icon: lock" />
								<input class="uk-input" type="password" name="password" required />
							</div>
						</div>
					</div>
					<div class="uk-margin">
						<label class="uk-form-label">Starting Number of Countries</label>
						<div class="uk-form-controls">
							<div class="uk-inline">
								<span class="uk-form-icon" uk-icon="icon: location" />
								<input
									class="uk-input"
									type="number"
									placeholder="3"
									name="startingCountries"
									required
								/>
							</div>
						</div>
					</div>
					<div class="uk-margin">
						<label class="uk-form-label">Starting Number of Troops</label>
						<div class="uk-form-controls">
							<div class="uk-inline">
								<span class="uk-form-icon" uk-icon="icon: cog" />
								<input class="uk-input" type="number" placeholder="5" name="startingTroops" required />
							</div>
						</div>
					</div>
					<div class="uk-margin">
						<label class="uk-form-label">Maximum Number of Players</label>
						<div class="uk-form-controls">
							<div class="uk-inline">
								<span class="uk-form-icon" uk-icon="icon: users" />
								<input class="uk-input" type="number" placeholder="10" name="maxPlayers" required />
							</div>
						</div>
					</div>
					<div class="uk-margin uk-grid-small uk-child-width-auto uk-grid">
						<label>
							<input class="uk-checkbox" type="checkbox" name="private" /> Make this a private game
						</label>
					</div>
					<div class="uk-margin">
						<label class="uk-form-label">
							Interval of Troop Drops [Realtime and Capital Supremacy Modes Only]
						</label>
						<Slider
							defaultValue={5}
							aria-labelledby="troopInterval"
							step={1}
							marks
							min={1}
							max={5}
							valueLabelDisplay="auto"
							name="troopInterval"
						/>
					</div>
					<div class="uk-margin">
						<Button type="submit" name="submit" value="create" variant="outlined" color="secondary">
							Commence WAR
						</Button>
					</div>
				</form>
			</Paper>
			<IconButton aria-label="return" color="secondary" onClick={setModeToZero}>
				<ArrowBackIcon
					style={{
						fontSize: '50'
					}}
				/>
				<Typography variant="subtitle1" style={{ color: 'white' }}>
					Back
				</Typography>
			</IconButton>
		</Grid>
	);
};

const CreateGame = ({ setModeToZero }) => {
	return (
		<Grid items xs={12}>
			<Paper className="gamebox-wrapper">
				<DialogContentText>Creating a new game...</DialogContentText>
				<form action={window.location.toString().replace(":3000", "").replace("play", "create")} method="POST">
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Select
								className="gamemap"
								id="type"
								name="map"
								label="Gamemap"
								required
								variant="outlined"
								placeholder="World"
							>
								<MenuItem value="realtime">World</MenuItem>
							</Select>
						</Grid>
						<Grid item xs={12}>
							<Select
								className="gamemode"
								id="type"
								name="type"
								label="Gamemode"
								required
								variant="outlined"
								placeholder="Regular"
							>
								<MenuItem value="Realtime">Regular</MenuItem>
								<MenuItem value="Campaign">Campaign</MenuItem>
								<MenuItem value="Capital">Capital Supremacy</MenuItem>
							</Select>
						</Grid>
						<Grid item xs={12}>
							<TextField type="text" placeholder="Username" name="username" required variant="outlined" />
						</Grid>
						<Grid item xs={12}>
							<TextField
								type="password"
								placeholder="Password"
								name="password"
								required
								variant="outlined"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								className="noOfPlayers"
								type="number"
								placeholder="Maximum number of players"
								name="maxPlayers"
								required
								variant="outlined"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								type="number"
								placeholder="Starting Number of Troops"
								name="startingTroops"
								required
								variant="outlined"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								type="number"
								placeholder="startingCountries"
								name="startingCountries"
								required
								variant="outlined"
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography gutterBottom>Please Specify Troop Interval</Typography>
							<Slider
								defaultValue={5}
								aria-labelledby="troopInterval"
								step={1}
								marks
								min={1}
								max={5}
								valueLabelDisplay="auto"
								name="troopInterval"
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControlLabel
								control={<Checkbox color="secondary" name="tncs" value="yes" required={true} />}
								label="I agree with the Imperium Games Terms and Conditions"
							/>
						</Grid>
						<Grid item xs={12}>
							<Button type="submit" name="submit" value="create" variant="outlined" color="secondary">
								Commence WAR
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>
			<IconButton aria-label="return" color="secondary" onClick={setModeToZero}>
				<ArrowBackIcon
					style={{
						fontSize: '50'
					}}
				/>
				<Typography variant="subtitle1">Back</Typography>
			</IconButton>
		</Grid>
	);
};

export default StartGameBox;
