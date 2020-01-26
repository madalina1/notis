import React, { Component } from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import CustomMarker from "../../shared/Marker/Marker";

const position = {
	lat: 47.151726,
	lng: 27.587914
}

interface MyProps { };
interface MyState { popoverHover: boolean };

class Home extends Component<MyProps, MyState> {
	constructor(props: any) {
		super(props);

		this.state = {
			popoverHover: false
		}

		this.onMarkerHover = this.onMarkerHover.bind(this);
	}


	onMarkerHover() {
		this.setState({ popoverHover: true });
	}

	render() {
		// const { popoverHover } = this.state;

		return (
			<LoadScript
				id="script-loader"
				googleMapsApiKey="AIzaSyD4RU7kMeIH8Heq9SdGGbrabDr_LpT4CE8"
			>
				<GoogleMap
					id='example-map'
					mapContainerStyle={{
						height: "100vh",
						width: "100%"
					}}
					zoom={15}
					center={position}

				>
					<CustomMarker position={position} text="Hello" />
				</GoogleMap>
			</LoadScript>
		)
	}
}

export default Home;