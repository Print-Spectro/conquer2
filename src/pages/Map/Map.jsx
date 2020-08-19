import React, { Component, useState } from 'react';
import { connect, loaddetails } from '../../websockets/index.js';
import { Paper, makeStyles, Grid } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import VectorMap from './VectorMap';
import './Map.css';
import { Options, OptionsDeploy, DonateForm } from './ActionButtons';
import { SpyDetails, PlayerBox, Title } from './Texts';
import { useHotkeys } from 'react-hotkeys-hook';
import WaitingRoom from './WaitingRoom';

class countryState {
	constructor(Troops, Player) {
		this.Troops = Troops;
		this.Player = Player;
	}
}

var socket = null;
// Number of troops in current player's base
var troops = 0;
// List of all countries
var countryStates = {};
// Map players to capitals
var capitals = {};
//Map players to their owners
var allegiances = {};
// List of all 'players: colours'
var playerColours = {};
// List of all players
var players = [];
// Current player name
var user = '';
// Interval for troop drops
var interval;
// Checking if everyone's ready
var playerReady = {};

function getUserTroops() {
	let userCountries = 0;
	for (var c in countryStates) {
		if (countryStates[c].Player == user) {
			userCountries++;
		}
	}
	return 3 + Math.floor(userCountries / 3);
}

//PRE: A hex colour of the format #______ and a percentage p (0 < p < 1)
//POST: The hex colour, p% darker
function darken(hex, p) {
	const r = Math.round(parseInt(hex.slice(1, 3), 16) * (1 - p));
	const g = Math.round(parseInt(hex.slice(3, 5), 16) * (1 - p));
	const b = Math.round(parseInt(hex.slice(5, 7), 16) * (1 - p));
	return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function parseCookie(txt) {
    return document.cookie.split('; ').map((s) => s.split('=')).filter((arr) => arr[0] == txt)[0][1]
}

function getInterval() {
	console.log(document.cookie);
	const decodedCookie = decodeURIComponent(document.cookie).replace(/ /g, '').split(';');

	for (let i = 0; i < decodedCookie.length; i++) {
		const elem = decodedCookie[i].split('=');
		if (elem[0] === 'type') {
			var type = elem[1];
			break;
		}
	}

	if (type === 'realtime' || type === 'capital') {
		for (let i = 0; i < decodedCookie.length; i++) {
			const elem = decodedCookie[i].split('=');
			if (elem[0] === 'interval') {
				return elem[1];
			}
		}
	} else {
		return 8 * 60; //8 hours
	}
}

function getOwner(player) {
	while (player != allegiances[player]) {
        player = allegiances[player];
        if (player === undefined || player === "") {
            alert("glitch")
        }
	}
	return player;
}

class GameMap extends Component {
	constructor() {
		super();
		this.state = { lobby: true, base: parseCookie('start'), isUnrelated: null };

		let updateTime = () => {
			let date = new Date();
			this.state.base = Math.floor(date.getTime() / 1000);
		};

        if (parseCookie('type') === 'capital') {
            this.state.isUnrelated = (iso) => {
                return !Object.values(capitals).includes(iso);
            }
        } else {
            this.state.isUnrelated = (iso) => {
                let v = countryStates[iso];
                return typeof v === 'undefined' || v.Player !== user; //shouldn't need getOwner as it's definitely not a capital game
            }
        }

		this.SideBar = this.SideBar.bind(this);

		socket = connect();
		var keepAlive = (keepAlive = window.setInterval(() => {
			socket.send('{}');
		}, 54 * 1000));

		//Ascertain from cookies the base troop drop time intervals
		interval = getInterval();
		//Ascertain from cookies the current player's username
		user = parseCookie('username');

		socket.onmessage = (msg) => {
			var action = JSON.parse(msg.data);
			window.clearInterval(keepAlive);
			keepAlive = window.setInterval(() => {
				socket.send('{}');
			}, 54 * 1000);
			switch (action.Type) {
				case 'updateTroops':
					user = action.Player;
					troops += action.Troops;
					if (action.ID == 1) {
						updateTime();
					}
					break;
				case 'updateCountry':
					let ok = typeof countryStates[action.Country] === 'undefined';
					if (ok || getOwner(countryStates[action.Country].Player) !== getOwner(action.Player)) {
						if (Object.keys(capitals).some((key) => capitals[key] == action.Country)) {
							//change allegiance
							allegiances[countryStates[action.Country].Player] = getOwner(action.Player);
						}
						countryStates[action.Country] = new countryState(action.Troops, action.Player);
					} else {
						if (action.Player !== '') {
							countryStates[action.Country].Troops += action.Troops;
							if (countryStates[action.Country].Troops < 0) {
								console.log(action);
							}
						} else {
							if (Object.keys(capitals).some((key) => capitals[key] == action.Country)) {
								//change allegiance
								allegiances[countryStates[action.Country].Player] = getOwner(action.Player);
							}
							countryStates[action.Country].Troops = action.Troops;
						}
					}
					break;
				case 'readyPlayer':
					console.log('readyPlayer token received. Setting ready state to true');
					playerReady[action.Player] = true;
					console.log(playerReady);
					break;
				case 'start':
					this.setState({ lobby: false });
					break;
				case 'newPlayer':
					if (!players.some((player) => player === action.Player)) {
						console.log(action.Player + ' has entered the chat bois as: ' + action.Country);
						playerColours[action.Player] = action.Country;
						players.push(action.Player);
                        playerReady[action.Player] = false;
                        allegiances[action.Player] = action.Player;
					}
					break;
				case 'newCapital':
					capitals[action.Player] = action.Country;
					allegiances[action.Player] = countryStates[action.Country].Player;
					break;
				case 'won':
					alert(getOwner(action.Player) + ' won');
				/*if (user == action.Player) {
                window.location.replace("https://www.youtube.com/watch?v=tS_2hEmGnzA");
            } else {
                window.location.replace("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            }*/
			}
			this.forceUpdate();
		};
	}

	componentDidMount() {
		window.addEventListener('load', this.onLoad);
	}

	componentWillUnmount() {
		window.removeEventListener('load', this.onLoad);
	}

	onLoad() {
		window.scrollTo(0, window.screen.height / 3.8);
	}

	SideBar() {
		//CSS
		const classes = useStyles();
		//TODO: Fetch #troops, attack, move options, fix data vals

        const [ hidden, setHidden ] = useState(false);
        const [ hideUnrelated, setHideUnrelated ] = useState(false);

		useHotkeys('q', () =>
			setHidden((bool) => {
				return !bool;
			})
        );
        
        useHotkeys('c', () => 
            setHideUnrelated((bool) => {
                return !bool;
            })
        );

		// Spy Detail Information
		const [ name, setname ] = useState('');
		const [ pop_est, setpop_est ] = useState('');
		const [ gdp, setgdp ] = useState('');
		const [ subrg, setsubrg ] = useState('');
		const [ continent, setcontinent ] = useState('');

		//Currently Clicked Countries
		const [ fromCountry, setfromCountry ] = useState('');
		const [ toCountry, settoCountry ] = useState('');
		const [ toCountryOwner, settoCountryOwner ] = useState('');

		//For the snackbar display settings
		const [ openHelp, setOpenHelp ] = React.useState(false);

		//Show Deployment option?
		const [ allowDeploy, setallowDeploy ] = useState(false);

		//Show Move option?
		const [ allowMove, setallowMove ] = useState(false);

		//Show drop downs?
		const [ showDonate, setshowDonate ] = useState(false);
		const [ showAssist, setshowAssist ] = useState(false);
		const [ showMove, setshowMove ] = useState(false);
		const [ showDeploy, setshowDeploy ] = useState(false);

		//For sending socket message actions (e.g. donate)
		const [ targetPlayer, settargetPlayer ] = useState('');
		const [ numTroops, setnumTroops ] = useState(0);

		//Load up map initially
		const [ countriesLoaded, setcountriesLoaded ] = useState(false);

		// Map of ALL countries and their borders
		const [ countries, changeCountries ] = useState({});

		function loadMap() {
			fetch('/maps/world.txt')
				.then((raw) => raw.text())
				.then((raw) => {
					let sep = raw.includes('\r') ? '\r\n' : '\n';
					return raw.split(sep);
				})
				.then((lines) => lines.map((s) => s.split(' ')))
				.then((lines) =>
					lines.forEach((line) => {
						changeCountries((state) => ({
							...state,
							[line[0]]: line.slice(1)
						}));
					})
				);
		}

		if (!countriesLoaded) {
			loadMap();
			setcountriesLoaded(true);
		}

		const convertISO = (NAME, ISO_A2) => {
			if (NAME === 'Somaliland') return 'ZZ';
			if (NAME === 'N. Cyprus') return 'CP';
			return ISO_A2;
		};

		// ISO_A2 of source country
		const [ fromCountryISO, setFromCountryISO ] = useState('');
		// ISO_A2 of dest country
		const [ toCountryISO, setToCountryISO ] = useState('');

		const handleClick = (geo) => {
            const { NAME, ISO_A2 } = geo.properties;

			var iso_a2 = convertISO(NAME, ISO_A2);

			if (fromCountry === '') {
				if (getOwner(countryStates[iso_a2].Player) === getOwner(user)) {
					setFromCountryISO(iso_a2);

					setfromCountry(NAME);
					setallowDeploy(true);
				}
			} else if (NAME === fromCountry) {
				reset();
			} else if (countries[fromCountryISO].some((iso) => iso === iso_a2)) {
				setallowDeploy(false);
				settoCountry(NAME);
				let c = countryStates[iso_a2];
				settoCountryOwner(c === undefined ? '' : c.Player);
				setToCountryISO(iso_a2);
				if (getOwner(countryStates[iso_a2].Player) === getOwner(user)) {
					setallowMove(true);
				} else {
					setallowMove(false);
				}
			} else {
				if (getOwner(countryStates[iso_a2].Player) === getOwner(user)) {
					setFromCountryISO(iso_a2);

					setfromCountry(NAME);
					setallowDeploy(true);
				}
			}
		};

		const reset = () => {
			setToCountryISO('');
			setFromCountryISO('');
			setfromCountry('');
			settoCountry('');
			settoCountryOwner('');
			setallowDeploy(false);
			setallowMove(false);
		};

		//Handle functions for snackbar
		const handleOpenHelp = () => {
			setOpenHelp(true);
		};

		const handleDonate = () => {
			setshowDonate(!showDonate);
			if (!showDonate) {
				setnumTroops(0);
			}
		};

		const handleAssist = () => {
			setshowAssist(!showAssist);
			if (!showAssist) {
				setnumTroops(0);
			}
		};

		const handleMove = () => {
			setshowMove(!showMove);
			if (!showMove) {
				setnumTroops(0);
			}
		};

		const handleDeploy = () => {
			setshowDeploy(!showDeploy);
			if (!showDeploy) {
				setnumTroops(0);
			}
		};

		const handleCloseHelp = (event, reason) => {
			if (reason === 'clickaway') {
				return;
			}
			setOpenHelp(false);
		};

		//FIXME: Use useState hook here to avoid lag ?
		const handleNumTroops = (event) => {
			setnumTroops(event.target.value);
		};

		const handletargetPlayer = (event) => {
			settargetPlayer(event.target.value);
		};

		const handleColorFill = (geo) => {
			while (!countriesLoaded) {}
            const { NAME, ISO_A2 } = geo.properties;

            var iso_a2 = convertISO(NAME, ISO_A2);
            
            if (hideUnrelated && this.state.isUnrelated(iso_a2)) {
                return 'none';
            }

			try {
				var col = '#a69374';
				if (countryStates[iso_a2] !== undefined) {
					if (countryStates[iso_a2].Player !== '') {
						col = playerColours[getOwner(countryStates[iso_a2].Player)];
					}
				}
				if (
					fromCountryISO !== '' &&
					countries[fromCountryISO] !== undefined &&
					countries[fromCountryISO].some((iso) => iso === iso_a2)
				) {
					return darken(col, 0.2);
				}
				return col;
			} catch (TypeError) {
				return '#a69374';
			}
		};

		return (
			<div>
				{players.length !== 0 && <PlayerBox classes={classes} playerColours={playerColours} hidden={hidden} allegiances={allegiances}/>}
				{!hidden ? (
					<Paper className={classes.sidebar}>
						<Grid container style={{ alignText: 'center' }}>
							<Title
								handleCloseHelp={handleCloseHelp}
								handleOpenHelp={handleOpenHelp}
								openHelp={openHelp}
								user={user}
								troops={troops}
								startTime={this.state.base}
								interval={interval}
								nextTroops={getUserTroops()}
							/>
							{/* Show Donation options when clicked on Donate Button */}
							{fromCountry === '' && (
								<DonateForm
									classes={classes}
									handleDonate={handleDonate}
									handletargetPlayer={handletargetPlayer}
									handleNumTroops={handleNumTroops}
									showDonate={showDonate}
									numTroops={numTroops}
									targetPlayer={targetPlayer}
									socket={socket}
									user={user}
									players={players}
									reset={reset}
								/>
							)}

							{/* Only show Attack and move/assist options when two countries clicked */}
							{toCountry !== '' && (
								<Grid item xs={12}>
									<Options
										classes={classes}
										toCountry={toCountry}
										fromCountry={fromCountry}
										toCountryOwner={toCountryOwner}
										allowMove={allowMove}
										numTroops={numTroops}
										handleNumTroops={handleNumTroops}
										handleMove={handleMove}
										handleAssist={handleAssist}
										showMove={showMove}
										showAssist={showAssist}
										fromCountryISO={fromCountryISO}
										toCountryISO={toCountryISO}
										socket={socket}
										user={user}
										reset={reset}
									/>
								</Grid>
							)}

							{/* Deploy troops from base to country */}
							{allowDeploy && (
								<OptionsDeploy
									classes={classes}
									numTroops={numTroops}
									handleNumTroops={handleNumTroops}
									fromCountry={fromCountry}
									handleDeploy={handleDeploy}
									showDeploy={showDeploy}
									fromCountryISO={fromCountryISO}
									socket={socket}
									user={user}
									troops={troops}
									reset={reset}
								/>
							)}

							{/* Only Show SpyDetails when not clicked anything */}
							<Grid item xs={12}>
								{fromCountry === '' &&
								name !== '' && (
									<SpyDetails
										name={name}
										subrg={subrg}
										continent={continent}
										pop_est={pop_est}
										gdp={gdp}
									/>
								)}
							</Grid>
						</Grid>
					</Paper>
				) : null}
				;
				<VectorMap
					setname={setname}
					setpop_est={setpop_est}
					setsubrg={setsubrg}
					setcontinent={setcontinent}
					setgdp={setgdp}
					handleColorFill={handleColorFill}
					handleClick={handleClick}
					countryStates={countryStates}
                    convertISO={convertISO}
                    hideUnrelated={hideUnrelated}
                    isUnrelated={this.state.isUnrelated}
				/>
			</div>
		);
	}

	render() {
		return this.state.lobby ? (
			<WaitingRoom playerColours={playerColours} user={user} socket={socket} playerReady={playerReady} />
		) : (
			<body id="map-page">
				<this.SideBar />
			</body>
		);
	}
}

const useStyles = makeStyles((theme) => ({
	sidebar: {
		marginLeft: '70%',
		marginTop: '10%',
		background: fade('#000000', 0.8),
		color: 'white',
		padding: theme.spacing(2),
		position: 'fixed',
		width: '30%',
		height: '80%',
		borderRadius: '5%',
		boxShadow: '0px 10px 50px #555'
	},
	players: {
		background: fade('#000000', 0.8),
		color: 'white',
		padding: theme.spacing(2),
		position: 'fixed',
		boxShadow: '0px 10px 50px #555'
	},
	buttons: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	button: {
		marginTop: theme.spacing(3),
		marginLeft: theme.spacing(1)
	},
	input: {
		minWidth: 120,
		marginRight: theme.spacing(2)
	},
	select: {
		borderWidth: '1px',
		borderColor: 'yellow'
	}
}));

export default GameMap;
export { playerReady };
