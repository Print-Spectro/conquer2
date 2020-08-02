import React, { Component, useState, useEffect, useRef } from 'react';
import './NewHome.css';
import Ticker from 'react-ticker';
import PageVisibility from 'react-page-visibility';
import videoSource from '../../media/fireball.mp4';

const MoveStuffAround = () => {
	const [ pageIsVisible, setPageIsVisible ] = useState(true);

	const handleVisibilityChange = (isVisible) => {
		setPageIsVisible(isVisible);
	};

	return (
		<PageVisibility onChange={handleVisibilityChange}>
			{pageIsVisible && (
				<Ticker>
					{({ index }) => (
						<div>
							<h1>This is the Headline of element #{index}!</h1>
							<img src="www.my-image-source.com/" alt="" />
						</div>
					)}
				</Ticker>
			)}
		</PageVisibility>
	);
};

export default class NewHome extends Component {
	render() {
		return (
			<div>
				<div className="header">
					<div className="container">
						<a className="logo">C O N Q U E R &ensp; 2 . 0</a>
						<div className="user-panel">
							<a href="#">Login</a>
							&ensp; | &ensp;
							<a href="#">Register</a>
						</div>
					</div>
				</div>
				<section>
					<img className="mySlides" src="../../media/war.png" style={{ width: '100%' }} />
					<img className="mySlides" src="../../media/war2.png" style={{ width: '100%' }} />
				</section>
				{/* <div>
					<Video />
				</div> */}
				<section className="slideshow">
					<div className="latest-slido">
						<div className="ln-title">
							<div className="latest-ticker">
								<MoveStuffAround />
							</div>
						</div>
					</div>
				</section>
			</div>
		);
	}
}

function Video() {
	useEffect(() => {
		attemptPlay();
	}, []);
	const videoEl = useRef(null);
	const attemptPlay = () => {
		videoEl &&
			videoEl.current &&
			videoEl.current.play().catch((error) => {
				console.error('Error attempting to play', error);
			});
	};
	return (
		<div className="video">
			<video muted autoPlay loop className="home-video" id="home-video">
				<source playsInline src={videoSource} type="video/mp4" alt="This is Sparta!" />
				What kind of browser version are you on... Your browser unfortunately does not yet support the video
				tag!
			</video>
		</div>
	);
}
