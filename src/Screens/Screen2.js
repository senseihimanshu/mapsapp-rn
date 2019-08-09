import React, {Component} from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';

const api_key = 'AIzaSyC2QhtACfVZ2cr9HVvxQuzxd3HT36NNK3Q';

class Screen2 extends Component {
    state = {
        suggestionData: [],
        query: ''
    };

    searchSuggestion = async (term) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
                params: {
                    type: term,
                    radius: 16093.4,
                    key: api_key,
                    location: "37.76999,-122.44696",
                },
            });
            console.log(response);
            this.setState({suggestionData: response.data.results});
        } catch(error) {
            // this.setState({
            //     error,
            //     isLoading: false
            // });
            console.log(error)
        };
    };

    render() {
        const {query, suggestionData} = this.state;
        return (
            <View style={{flex: 1}}>
                <View style={styles.container}>
                    <Autocomplete
                        autoCapitalize="none"
                        autoCorrect={false}
                        // data={suggestionData}
                        defaultValue={query}
                        inputContainerStyle={{borderColor:'white'}}
                        onChangeText={async (text) => {
                            this.setState({query: text});
                            await this.searchSuggestion(text);
                        }}
                        placeholder={'Search'}
                        listStyle={{borderWidth: 0,}}
                        listContainerStyle={{
                            flex: 1,
                        }}
                        hideResults={query === ''} // same as hideResults={query === '' ? true : false}
                        // renderItem={({item}) => (
                        //     <TouchableOpacity
                        //         onPress={() => {
                        //             this.setState({query: item})
                        //             // this.handleOnPress(title);
                        //             this.setState({query: ''});
                        //         }}>
                        //         <Text style={styles.itemText}>
                        //             {item}
                        //         </Text>
                        //     </TouchableOpacity>
                        // )
                        // }
                    />
            </View>
                <MapView
                    style={{flex: 1, height: "100%", width: "100%"}}
                    region={{
                        latitude: 37.76999,
                        longitude: -122.44696,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                    showsUserLocation={true}
                >
                    { this.state.suggestionData.length > 1 && this.state.suggestionData.map((item, index) => (
                            <Marker
                                key={index}
                                coordinate={{ latitude: item.geometry.location.lat, longitude: item.geometry.location.lng}}
                                title={item.name}
                            />
                        ))
                    }
                </MapView>
            </View>
        );
    }
}

export default Screen2;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 40,
        zIndex: 1,
        elevation: Platform.OS === 'android' ? 10 : 1,
        paddingHorizontal:10,
        borderRadius:15,
        marginHorizontal:5,
        borderWidth: 3,
        borderColor: "#000"
    },
    itemText: {
        fontSize: 17 ,
        paddingVertical: 2.5,
    },
});