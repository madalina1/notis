import React, { Component } from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import CustomMarker from "../../shared/Marker/Marker";
import notaries from './notaries.json';
import translators from './translators.json';


const position = {
	lat: 47.151726,
	lng: 27.587914
}

interface MyProps { choice: boolean };
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
					zoom={12}
					center={position}

				>
					{
						this.props.choice ?
							notaries.map(notary =>
								<CustomMarker
									position={{
										lat: Number(notary.address.lat),
										lng: Number(notary.address.long)
									}}
									title="Notary"
									name={notary.personName}
									languages={["English", "Romanian"]}
									phoneNumber={notary.phoneNumber}
									schedule={notary.schedule}
									address={notary.address}
								/>) :
							translators.map(translator =>
								<CustomMarker
									position={{
										lat: Number(translator.address.lat),
										lng: Number(translator.address.long)
									}}
									title="Translator"
									name={translator.personName}
									languages={translator.languages}
									phoneNumber={translator.phoneNumber}
									schedule={translator.schedule}
									address={translator.address}
								/>)
					}
				</GoogleMap>
			</LoadScript>
		)
	}
}

export default Home;