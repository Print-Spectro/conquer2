import React, { Component } from 'react';
import './WaitingRoom.css';
import { PlayerBox } from './Texts';

export default class WaitingRoom extends Component {
	render() {
		var playerColours = this.props.playerColours;
		return (
			<div className="waiting-room">
				<div className="backdrop" />
				<header className="container">
					{/* <div id="tv">WAITING ROOM</div> */}
					<h2>LOBBY - Waiting for players...</h2>
				</header>
				<body>
					<div className="player-list">
						<div className="players">
							<h4>Joining Players (Max 20)</h4>
							{'Game ID: ' +
								document.cookie
									.split('; ')
									.map((s) => s.split('='))
									.filter((arr) => arr[0] == 'id')[0][1]}

							{Object.keys(playerColours).map(function(player) {
								var colour = playerColours[player];
								return (
									<div className="player-name" key={player}>
										<span style={{ color: colour }}>{player}</span>
									</div>
								);
							})}
						</div>
					</div>

					<PlayerBox />
				</body>
			</div>
		);
	}
}
