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
					<CustomMarker 
						position={position} 
						text="Hello" 
						title="Alina Notary" 
						name="Alina Aanei" 
						languages={["English", "Romanian"]}  
						phoneNumber="0751753645"
						schedule={{
							"Mon": {startH: '09:00', endH: '15:00', specialHours: null},
							"Tue": {startH: '09:00', endH: '15:00', specialHours: null},
							"Wed": {startH: '09:00', endH: '15:00', specialHours: null},
							"Thu": {startH: '09:00', endH: '15:00', specialHours: null},
							"Fri": {startH: '09:00', endH: '15:00', specialHours: null},
							"Sat": {startH: '09:00', endH: '15:00', specialHours: null},
							"Sun": {startH: '09:00', endH: '15:00', specialHours: null}
						}}
						address={{
							city: "Bacau",
							locality: "Bacau",
							courtOfAppeal: "Bacau"
						}}
					/>
				</GoogleMap>
			</LoadScript>
		)
	}
}

export default Home;