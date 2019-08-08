import React, {Component} from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import MapView from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            latitude: null,
            longitude: null,
            error:null,

            text: ''
        };
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
        );
    }

    render() {
        const homePlace = {
            description: 'Home',
            geometry: { location: { lat: this.state.latitude, lng: this.state.longitude } },
        };
        const workPlace = {
            description: 'Work',
            geometry: { location: { lat: this.state.latitude, lng: this.state.longitude } },
        };

        return (
            <View style={{flex: 1}}>
                    <MapView.Callout style={{backgroundColor: "#fff", position: "absolute", top: 40, elevation: 10, width: "100%"}}>
                        <GooglePlacesAutocomplete
                            placeholder="Search"
                            minLength={2} // minimum length of text to search
                            autoFocus={false}
                            returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                            listViewDisplayed="auto" // true/false/undefined
                            fetchDetails={true}
                            renderDescription={row => row.description} // custom description render
                            onPress={(data, details = null) => {
                                // 'details' is provided when fetchDetails = true
                                console.log(data);
                                console.log(details);
                            }}
                            getDefaultValue={() => {
                                return ''; // text input default value
                            }}
                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: 'AIzaSyC2QhtACfVZ2cr9HVvxQuzxd3HT36NNK3Q',
                                language: 'en', // language of the results
                                types: '(cities)', // default: 'geocode'
                            }}
                            styles={{
                                description: {
                                    fontWeight: 'bold',
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb',
                                },
                            }}
                            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                            currentLocationLabel="Current location"
                            nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                            GoogleReverseGeocodingQuery={{
                                // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                            }}
                            GooglePlacesSearchQuery={{
                                // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                rankby: 'distance',
                                types: 'food',
                            }}
                            filterReverseGeocodingByTypes={[
                                'locality',
                                'administrative_area_level_3',
                            ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                            predefinedPlaces={[homePlace, workPlace]}
                            debounce={200}
                        />
                    </MapView.Callout>
                <MapView
                    style={{flex: 1, height: "100%", width: "100%", elevation: -10}}
                    region={{ latitude: this.state.latitude, longitude: this.state.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}}
                    showsUserLocation={true}
                />
            </View>
        );
    }
}

export default Map;