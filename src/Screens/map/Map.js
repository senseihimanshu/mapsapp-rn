import React, { Component } from "react";
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import axios from "axios";
import {dismissModal, showModal, wrapIntoModal} from 'expo-modal';
import { Rating } from "react-native-ratings";
import Autocomplete from "react-native-autocomplete-input";

import constants from "./constants/constants";

export async function request_location_runtime_permission() {

    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'ReactNativeCode Location Permission',
                'message': 'ReactNativeCode App needs access to your location '
            }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            Alert.alert("Location Permission Granted.");
        }
        else {

            Alert.alert("Location Permission Not Granted");

        }
    } catch (err) {
        console.warn(err)
    }
}

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

  componentWillMount() {
      // requestCameraPermission = async() => {
      //     try {
      //         const granted = await PermissionsAndroid.request(
      //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      //             {
      //                 title: 'Map App requires location permission',
      //                 message:
      //                     'Map App needs access to your location ' +
      //                     'so you can use it well.',
      //                 buttonNeutral: 'Ask Me Later',
      //                 buttonNegative: 'Cancel',
      //                 buttonPositive: 'OK',
      //             },
      //         );
      //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //             console.log('You can use the location');
      //         } else {
      //             console.log('Location permission denied');
      //         }
      //     } catch (err) {
      //         console.warn(err);
      //     }
      // };
  }


    componentDidMount = async() => {
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

    //asking for location permission
        await request_location_runtime_permission()
    };


  searchSuggestion = async (term) => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                keyword: term,
                radius: constants.radius,
                key: constants.key,
                location: `${this.state.region.latitude},${this.state.region.longitude}`,
            },
        });
        console.log(response);
        this.setState({suggestionData: response.data.results}, () => {
            console.log(this.state.suggestionData)
        });
    } catch(error) {
        console.log(error)
    }
};



  handleSearch = async() => {
      console.log('HandleSearch, State', this.state);
      try{
          await axios
              .get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
                  params: {
                      location: `${this.state.region.latitude},${this.state.region.longitude}`,
                      radius: constants.radius,
                      keyword: this.state.query,
                      key: constants.key
                  }
              })
              .then(response => {
                  console.log("handleSearch", response);
                  this.setState({
                      markers: response.data.results
                  }, ()=> {console.log('Markers', this.state.markers)});
              });
      }catch(error){
          console.log(error, 'Inside handleSearch');
      }

  };

  render() {
    const { latitude, longitude } = this.state.region;
    const { markers, query, suggestionData } = this.state;


    return (
        wrapIntoModal(
      <View
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
            marginTop: '8%'
        }}
      >
      {latitude && longitude ? (
          <MapView
              region={this.state.region}
              showsUserLocation={true}
              style={{ ...styles.map, zIndex: -10, elevation: -1 }}
          >
              <Circle
                  center={{
                      latitude,
                      longitude
                  }}
                  radius={constants.radius}
                  strokeWidth={1}
                  strokeColor={"#1a66ff"}
                  fillColor={"rgba(230,238,255,0.5)"}
              />

              {/* Current position marker */}
              <Marker
                  key={'center_position'}
                  title={"Center"}
                  description={"position you fixed"}
                  coordinate={{
                      latitude: latitude,
                      longitude: longitude
                  }}
                  pinColor={"green"}
                  draggable
                  onDragEnd={e => {
                      console.log("inside draggable", e.nativeEvent.coordinate);
                      this.setState({
                          region: {...this.state.region,
                              latitude: e.nativeEvent.coordinate.latitude,
                              longitude: e.nativeEvent.coordinate.longitude}
                      }, () => this.handleSearch());
                  }}
              />

              {/* Adding relevant markers on the map */}
              {markers.length > 0 &&
              markers.map(cur => {
                  return (
                      <Marker
                          key={(
                              `${cur.geometry.location.lat}${cur.geometry.location.lng}`
                          )}
                          title={cur.name}
                          description={cur.vicinity}
                          coordinate={{
                              latitude: cur.geometry.location.lat,
                              longitude: cur.geometry.location.lng
                          }}
                          onCalloutPress={() => {
                              console.log("i am ", cur);
                              showModal(
                                  <View style={{flex: 1, flexDirection: 'column', justifyContent: "space-between", backgroundColor: 'white', width: '100%'}}>
                                      <View style={{ flex: 0.6, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>

                                          {cur.photos ? (
                                              <Image style={{width: '100%', height: '40%'}}
                                                     source={{uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${cur.photos[0].photo_reference}&key=${constants.key}\n`}}
                                              />
                                          ) : (
                                              <Text />
                                          )}

                                          <Text style={{color: '#777'}}>Place: <Text style={{fontSize: 22, color: '#393'}}> { cur.name }</Text></Text>
                                          <Text style={{color: '#777'}}>Address: <Text style={{fontSize: 22, color: '#393'}}>{ cur.vicinity }</Text></Text>

                                          {cur.opening_hours ? (<Text style={{color: '#777'}}>Currently Open: <Text style={{fontSize: 22, color: '#393'}}>{ cur.opening_hours.open_now ? 'Yes' : 'No' }</Text></Text>): (<Text />)}


                                          <Rating
                                              style={{ paddingVertical: 10 }}
                                              startingValue={cur.rating}
                                              readonly={true}
                                          />


                                          <Button title="Close" onPress={()=>dismissModal()}>Close</Button>


                                      </View>
                                      <View>

                                      </View>
                                  </View>

                              );

                          }}
                      />
                  );
              })}
          </MapView>
      ) : (
          <Text>Please give location permission to this app!!!</Text>
      )}

        <Autocomplete containerStyle={styles.autocomplete}
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
              onPress={ () => {

                this.setState({ query: item.name }, async() => {
                    await this.handleSearch();
                    this.setState({query: ''});
                });
                // this.handleOnPress(query);
              }}
            >
              <Text style={styles.itemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
          <TouchableOpacity onPress={async() => { await this.handleSearch(); this.setState({query: ''}) }} style={{position: 'absolute', right: '6%', top: '1.4%', zIndex: 10}}>
              <Text>Search</Text>
          </TouchableOpacity>

      </View>
    ));
  }
}

export default Map;

styles = StyleSheet.create({
  autocomplete: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '90%',
  },
  map: {
    minWidth: "100%",
    position: 'absolute',
    top: 50,
    height: '90%',
  },
    itemText: {
      borderWidth: 1,
        borderColor: '#777',
        fontSize: 17 ,
        paddingVertical: 2.5,
        color: '#373'
    },

});
