import React, { Component } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import MapView, { Circle, Marker, Callout } from "react-native-maps";
import axios from "axios";
import Modal from "react-native-modal";
import { Rating } from "react-native-ratings";

import constants from "./constants/constants";

import Autocomplete from "react-native-autocomplete-input";

// import {Ionicons} from '@expo/vector-icons';

// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: null,
        longitude: null,
        latitudeDelta: constants.latitudeDelta,
        longitudeDelta: constants.longitudeDelta
      },
      regionError: null,
      markers: [],
      suggestionData: [],
      query: ''
    };
  }

  componentDidMount() {
    //getting current location of user
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("Current POSITION", position);
        this.setState({
          region: {
            ...this.state.region,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        });
      },
      error => this.setState({ regionError: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
  }


  searchSuggestion = async (term) => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                keyword: term,
                radius: constants.radius,
                key: constants.key,
                location: `${this.state.latitude},${this.state.longitude}`,
            },
        });
        this.setState({suggestionData: response.data.results}, () => {
            console.log(this.state.suggestionData)
        });
    } catch(error) {
        console.log(error)
    }
};



  handleSearch = () => {
    axios
      .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
        params: {
          location: `${this.state.latitude},${this.state.longitude}`,
          radius: constants.radius,
          keyword: this.state.text,
          key: constants.key
        }
      })
      .then(response => {
        console.log("handleSearch", response);
        this.setState({
          markers: response.data.results
        });
      });
  };

  render() {
    const { latitude, longitude } = this.state.region;
    const { markers, query, suggestionData } = this.state;

    return (
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          data={suggestionData}
          defaultValue={query}
          inputContainerStyle={{ borderColor: "white" }}
          onChangeText={async query => {
            this.setState({ query });
            await this.searchSuggestion(query);
          }}
          placeholder={"Search"}
          listStyle={{ borderWidth: 0 }}
          listContainerStyle={{
            flex: 1
          }}
          hideResults={query === ""} // same as hideResults={query === '' ? true : false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                this.handleSearch();
                this.setState({ query: '' }, () => {
                });
                // this.handleOnPress(query);
              }}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        {latitude && longitude ? (<Text>Hello!</Text>
          // <MapView
          //   region={this.state.region}
          //   showsUserLocation={true}
          //   style={{ ...styles.map }}
          // >
          //   <Circle
          //     center={{
          //       latitude,
          //       longitude
          //     }}
          //     radius={constants.radius}
          //     strokeWidth={1}
          //     strokeColor={"#1a66ff"}
          //     fillColor={"rgba(230,238,255,0.5)"}
          //   />

          //   {/* Current position marker */}
          //   <Marker
          //     title={"Center"}
          //     description={"position you fixed"}
          //     coordinate={{
          //       latitude: latitude,
          //       longitude: longitude
          //     }}
          //     pinColor={"green"}
          //     draggable
          //     onDragEnd={e => {
          //       console.log("inside draggable", e.nativeEvent.coordinate);
          //       this.setState({
          //         latitude: e.nativeEvent.coordinate.latitude,
          //         longitude: e.nativeEvent.coordinate.longitude
          //       });
          //     }}
          //   />

          //   {/* Adding relevant markers on the map */}
          //   {markers.length > 0 &&
          //     markers.map(cur => {
          //       return (
          //         <Marker
          //           key={(
          //             cur.geometry.location.lat + cur.geometry.location.lng
          //           ).toString()}
          //           title={cur.name}
          //           description={cur.vicinity}
          //           coordinate={{
          //             latitude: cur.geometry.location.lat,
          //             longitude: cur.geometry.location.lng
          //           }}
          //           onCalloutPress={() => {
          //             console.log("i am ", cur);
          //           }}
          //         />
          //       );
          //     })}
          // </MapView>
        ) : (
          <Text>Please give location permission to this app!!!</Text>
        )}
      </View>
    );
  }
}

export default Map;

styles = StyleSheet.create({
  map: {
    minHeight: "100%",
    minWidth: "100%"
  }
});
