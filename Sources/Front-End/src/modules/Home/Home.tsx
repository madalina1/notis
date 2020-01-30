import React, { Component } from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import CustomMarker from "../../shared/Marker/Marker";
import { INotary } from "../../models";

const position = {
	lat: 47.151726,
	lng: 27.587914
}

interface MyProps {
	choice: boolean
	data: INotary[];
};
interface MyState {
	popoverHover: boolean;
};

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
		return (
			<LoadScript
				id="script-loader"
				googleMapsApiKey="AIzaSyD4RU7kMeIH8Heq9SdGGbrabDr_LpT4CE8">
				<GoogleMap
					id='example-map'
					mapContainerStyle={{
						height: "100vh",
						width: "100%"
					}}
					zoom={12}
					center={position}>{
						this.props.data.map((item: INotary, index: number) =>
							(<CustomMarker
								key={index}
								position={{
									lat: Number(item.address.lat),
									lng: Number(item.address.long)
								}}
								title={this.props.choice ? 'Notary' : 'Translator'}
								name={item.personName}
								languages={this.props.choice ? ["English", "Romanian"] : item.languages}
								phoneNumber={item.phoneNumber}
								schedule={item.schedule}
								address={item.address}
							/>))
					}
				</GoogleMap>
			</LoadScript>
		)
	}
}

export default Home;