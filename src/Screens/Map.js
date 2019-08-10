import React, { Component } from "react";
import { View, Text, TextInput, Button, Image } from "react-native";
import MapView, { Circle, Marker, Callout } from "react-native-maps";
import axios from "axios";
import Modal from "react-native-modal";
import { Rating } from 'react-native-ratings';

// import {Ionicons} from '@expo/vector-icons';

// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,

      text: "",

      markers: [],

      isModalVisible: false,
      modal: {
          name: null,
          icon: null,
          vicinity: null,
          rating: 0
      }
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("DID MOUNT POSITION", position);
        this.setState(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null
          },
          () => {
            axios
              .get(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
                  this.state.latitude
                },${
                  this.state.longitude
                }&radius=16093.4&type=&keyword=&key=AIzaSyBpxHgXiW3tMKYqRRJMCyLpzsSWzAKOfJs`
              )
              .then(response => {
                console.log("inside DID MOUNT and axios", response);
                this.setState({
                  markers: response.data.results
                });
              });
          }
        );
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 }
    );
  }

  handleSearch = () => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
          this.state.latitude
        },${this.state.longitude}&radius=16093.4&type=&keyword=${
          this.state.text
        }&key=AIzaSyBpxHgXiW3tMKYqRRJMCyLpzsSWzAKOfJs`
      )
      .then(response => {
        console.log("handleSearch", response);
        this.setState({
          markers: response.data.results
        });
      });
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible }, () => {
      console.log("Inside toggleModal", this.state.isModalVisible);
    });
  };

  showModalInfo = info => {
    console.log(info, "inside show modal info");
    this.setState({
      modal: {
        name: info.name,
        icon: info.icon,
        vicinity: info.vicinity,
        rating: info.rating
      }
    }, () => {
      this.toggleModal();
      console.log('i am info', info);
    });
  };


  render() {
    return (
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        {/*<Callout style={{flex: 2, backgroundColor: "#fff", width: "100%", zIndex: 1, marginVertical: '8%'}}>*/}
        {/*    <GooglePlacesAutocomplete*/}
        {/*        placeholder="Search"*/}
        {/*        minLength={2} // minimum length of text to search*/}
        {/*        autoFocus={false}*/}
        {/*        returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype*/}
        {/*        listViewDisplayed="auto" // true/false/undefined*/}
        {/*        fetchDetails={true}*/}
        {/*        renderDescription={row => row.description} // custom description render*/}
        {/*        onPress={(data, details = null) => {*/}
        {/*            // 'details' is provided when fetchDetails = true*/}
        {/*            console.log(data);*/}
        {/*            console.log(details);*/}
        {/*        }}*/}
        {/*        getDefaultValue={() => {*/}
        {/*            return ''; // text input default value*/}
        {/*        }}*/}
        {/*        query={{*/}
        {/*            // available options: https://developers.google.com/places/web-service/autocomplete*/}
        {/*            key: 'AIzaSyBpxHgXiW3tMKYqRRJMCyLpzsSWzAKOfJs',*/}
        {/*            language: 'en', // language of the results*/}
        {/*            types: '(cities)', // default: 'geocode'*/}
        {/*        }}*/}
        {/*        styles={{*/}
        {/*            description: {*/}
        {/*                fontWeight: 'bold',*/}
        {/*            },*/}
        {/*            predefinedPlacesDescription: {*/}
        {/*                color: '#1faadb',*/}
        {/*            },*/}
        {/*        }}*/}
        {/*        // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list*/}
        {/*        // currentLocationLabel="Current location"*/}
        {/*        nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch*/}
        {/*        GoogleReverseGeocodingQuery={{*/}
        {/*            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro*/}
        {/*        }}*/}
        {/*        GooglePlacesSearchQuery={{*/}
        {/*            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search*/}
        {/*            rankby: 'distance',*/}
        {/*            types: 'food',*/}
        {/*        }}*/}
        {/*        filterReverseGeocodingByTypes={[*/}
        {/*            'locality',*/}
        {/*            'administrative_area_level_3',*/}
        {/*        ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities*/}
        {/*        // predefinedPlaces={[homePlace, workPlace]}*/}
        {/*        debounce={200}*/}
        {/*    />*/}
        {/*</Callout>*/}

        <View
          style={{
            marginTop: 36,
            borderWidth: 1,
            borderColor: "#ccc",
            paddingVertical: 8,
            paddingHorizontal: 6,
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <TextInput
            style={{
              paddingVertical: 8,
              paddingHorizontal: 8,
              height: 40,
              fontSize: 18,
              color: "#777"
            }}
            placeholder="Type here to search!"
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
          />
          <View style={{ position: "absolute", top: 6, right: 8 }}>
            <Button title="search" onPress={this.handleSearch} />
          </View>
        </View>

        {console.log("state log inside render", this.state)}
        {this.state.latitude && this.state.longitude ? (
          <MapView
            style={{ flex: 8, height: "100%", width: "100%" }}
            region={{
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              latitudeDelta: 0.55,
              longitudeDelta: 0.25
            }} //latitudeDelta: 0.0922, longitudeDelta: 0.0421
            showsUserLocation={true}
          >
            <Circle
              key={(this.state.latitude + this.state.longitude).toString()}
              center={{
                latitude: this.state.latitude,
                longitude: this.state.longitude
              }}
              radius={16093.4}
              strokeWidth={1}
              strokeColor={"#1a66ff"}
              fillColor={"rgba(230,238,255,0.5)"}
            />

            <Marker
              title={"center position"}
              description={"position you fixed"}
              coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude
              }}
              pinColor={"green"}
              draggable
              onDragEnd={e => {
                console.log("inside draggable", e.nativeEvent.coordinate);
                this.setState(
                  {
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude
                  },
                  () => {
                    this.handleSearch();
                  }
                );
              }}
            />

            {console.log("check", this.state.markers.length)}
            {this.state.markers.length > 0 &&
              this.state.markers.map(cur => {
                return (
                  <View>
                    <Marker
                      key={(
                        cur.geometry.location.lat + cur.geometry.location.lng
                      ).toString()}
                      title={cur.name}
                      description={"position you fixed"}
                      coordinate={{
                        latitude: cur.geometry.location.lat,
                        longitude: cur.geometry.location.lng
                      }}
                      onCalloutPress={() => {
                        console.log("Pressed Callout");
                        this.showModalInfo(cur);
                        console.log('i am ', cur);
                      }}
                    />
                  </View>
                );
              })}
          </MapView>
        ) : (
          <Text>Loading...</Text>
        )}

        {
          <Modal isVisible={this.state.isModalVisible} style={{backgroundColor: 'white'}}>
            <View style={{flex: 1, flexDirection: 'column', justifyContent: "space-between"}}>
              <View style={{ flex: 0.6, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                <Text style={{color: '#777'}}>Place: <Text style={{fontSize: 22, color: '#393'}}> { this.state.modal.name }</Text></Text>
                <Text style={{color: '#777'}}>Address: <Text style={{fontSize: 22, color: '#393'}}>{ this.state.modal.vicinity }</Text></Text>

 
                <Rating
                  style={{ paddingVertical: 10 }}
                  startingValue={this.state.modal.rating}
                  readonly={true}
                />

              </View>
              <View>
                <Image
                  style={{width: 50, height: 50}}
                  source={this.state.modal.icon}
                  />
                <Button title="Close" onPress={this.toggleModal} />
              </View>
            </View>
          </Modal>
        }
      </View>
    );
  }
}

export default Map;
