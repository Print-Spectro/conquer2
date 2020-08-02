import React, { Component } from 'react';
import StartGameBox from './StartGameBox';
import Grid from '@material-ui/core/Grid';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
// import videoSource from '../../media/HomeBackgroundVideo.mp4';
import videoSource from '../../media/fireball.mp4';
import './Home.css';

class Home extends Component {
	render() {
		return (
			<div className="home-page">
				<Video />
				<CssBaseline />
				<Grid container>
					<Grid item xs={12}>
						<Typography variant="h2">CONQUER 2.0</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="subtitle1">Fight to the death...</Typography>
					</Grid>
				</Grid>
				<StartGameBox />
				<Footer />
			</div>
		);
	}
}

const Video = () => {
	return (
		<div class="fullscreen-bg">
			<video muted autoPlay loop className="fullscreen-bgvideo" id="home-video">
				<source playsInline src={videoSource} type="video/mp4" alt="This is Sparta!" />
				What kind of browser version are you on... Your browser unfortunately does not yet support the video
				tag!
			</video>
		</div>
	);
};

function Footer() {
	return (
		<div style={{ position: 'fixed' }}>
			<Grid
				container
				xs={12}
				style={{
					color: 'white',
					position: 'fixed',
					left: 0,
					bottom: 0,
					width: '100%',
					background: fade('#000000', 0.8),
					color: 'white',
					textAlign: 'center'
				}}
			>
				<Grid item xs={12}>
					<Typography variant="subtitle1">Conquer V2.0 &copy;</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="subtitle1">By Imperium Games</Typography>
				</Grid>
			</Grid>
		</div>
	);
}

export default Home;
