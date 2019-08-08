import React from 'react';
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import MapScreen from './src/Screens/Map'
import Screen2 from "./src/Screens/Screen2";
import Screen3 from "./src/Screens/Screen3";
import Screen4 from "./src/Screens/Screen4";
import Screen5 from "./src/Screens/Screen5";

  const tabOptions = {
      tabBarOptions: {
          activeTintColor:'#fff',
          inactiveTintColor:'rgba(255,255,255,0.5)',
          style:{
              backgroundColor:'rgba(0,0,0,1)',
              borderTopWidth:1,
              borderTopColor:'#D3D3D3'
          },
          indicatorStyle: {
              backgroundColor: 'red'
          },
          labelStyle: {
              fontSize: 18,
              paddingBottom: 10,
          }
      },
  };

  const App = createBottomTabNavigator({
          map: {screen: MapScreen, navigationOptions: {title: 'Map'}},
          screen2: {screen: Screen2},
          screen3: {screen: Screen3},
          screen4: {screen: Screen4},
          screen5: {screen: Screen5},
        }, tabOptions
    );

export default createAppContainer(App);

