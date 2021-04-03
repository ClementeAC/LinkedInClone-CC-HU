import React from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Entypo} from "@expo/vector-icons";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Button,
  Image,
  ScrollView
} from "react-native";
import styles from "./profile.css";

export default class profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      y : 0,
      loading : false,
      username: "",
      name: "",
      lastName: "",
      password: "",
      email: "",
      title: "",
      currentJobTitle: "",
      country: "",
      phone: "",
      education:[], 
      skills: [],
      editData: false,
      id: 0,
    };
  }

  componentDidMount() {
    this.getUser();
    this.setState({
      name: "Clemente",
      lastName: "Castejón",
      title: "Student at Universidad Rafael Urdaneta",
      currentJobTitle: "English Teacher at CEVAZ",
      education: ["Colegio Alemán de Maracaibo", "Universidad Rafael Urdaneta"],
      skills: ["English", "Spanish", "Web development", "Networking experience"],
      country: "Venezuela",
    });
  }

  getUser = async () => {
    let res = "";
    try {
      res = await AsyncStorage.getItem("user");
    } catch (error) {
      // Error retrieving data
    }
    this.setState({
      username: JSON.parse(res).username,
      email: JSON.parse(res).email,
      id: JSON.parse(res).user_id,
      phone: JSON.parse(res).phone,
    });
  };

  async saveData() {
    console.log("llego");
    const form = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };
    let id = this.state.id;
    console.log(id.toString(), form);
    const res = await axios.put(
      "https://listical.herokuapp.com/api/users/" + id.toString(),
      form
    );
    console.log(res);
    try {
      await AsyncStorage.setItem("user", JSON.stringify(res.data[0]));
      this.setState({ editData: false });
    } catch (e) {
      //error
    }
  }

  logout = async (replace) => {
    Alert.alert(
      "Logout",
      "Are you sure you want log out?",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        {
          text: "Log out",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("user");
              replace("Root");
            } catch (error) {
              // Error retrieving data
            }
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  onScrollTop = (event, setOptions) => {
    var y = event.nativeEvent.contentOffset.y;
    this.setState({ y });
    if(this.state.y >= y){
      setOptions({
        headerShown: true,
      });
      console.log('true');
    }else{
      setOptions({
        headerShown: false,
      });
      console.log('false');
    }
  }
  
  render() {
    const { navigate, route, replace, setOptions } = this.props.navigation;

    if (this.state.editData == true) {
      return (
        <View
          style={{
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 25, fontWeight: "bold" }}>
            Edit your data
          </Text>
          <Text style={{ fontSize: 20, marginTop: 15 }}>Username:</Text>
          <TextInput
            style={{ marginTop: 15, fontSize: 15 }}
            placeholder="Enter new username"
            placeholderTextColor="#d8412e"
            onChangeText={(username) => this.setState({ username: username })}
          />
          <Text style={{ fontSize: 20, marginTop: 15 }}>Password:</Text>
          <TextInput
            style={{
              marginTop: 20,
              fontSize: 15,
              borderColor: "#d8412e",
              marginBottom: 15,
            }}
            placeholder="Enter new password"
            placeholderTextColor="#d8412e"
            onChangeText={(password) => this.setState({ password: password })}
          />
          <TouchableOpacity
            onPress={() => this.saveData()}
            style={{
              marginHorizontal: 90,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 30,
              backgroundColor: "#d8412e",
              paddingVertical: 13,
              paddingHorizontal: 25,
              borderRadius: 23,
              height: 40,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "white" }}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <ScrollView 
            onScrollEndDrag={(event) => this.onScrollTop(event, setOptions)}
          >
          <View
            style={{
              backgroundColor: "white",
              alignItems: "center",
            }}
          >
            <Image source={require("../../assets/profile.png")} style={{width: 125, height: 125, borderRadius:60, resizeMode:"contain", marginTop: 20}}/>
            <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>
              {this.state.username}
            </Text>
            <Text style={{ color: "gray", marginTop: 5 }}>
              {this.state.name} {this.state.lastName}
            </Text>
            <Text style={{ color: "gray", marginBottom: 2 }}>
              {this.state.email}
            </Text>
            <Text style={{ color: "gray", marginBottom: 10 }}>
              {this.state.phone}
            </Text>
            <Text style={{ marginBottom: 20, fontWeight:"bold", fontSize: 17}}>
              {this.state.title}
            </Text>
            <MaterialIcons name="work" color="blue" size={24}/>
            <Text style={{fontWeight:"bold", fontSize:18}}>Current Job Title</Text>
            <Text style={{marginTop:5, fontSize: 17}}>{this.state.currentJobTitle}</Text>
            <MaterialIcons name="place" color="blue" size={24} style={{marginTop: 20}}/>
            <Text style={{fontWeight:"bold", fontSize:18}}>Country of residence</Text>
            <Text style={{marginTop:5, fontSize: 17}}>{this.state.country}</Text>
            <FontAwesome5 name="user-graduate" color="blue" size={23} style={{marginTop: 20}}/>
            <Text style={{fontWeight:"bold", fontSize:18}}>Education</Text>
            <Text style={{marginTop:5, fontSize: 17}}>{this.state.education[0]}</Text>
            <Entypo name="dot-single" color="blue" size={15}/>
            <Text style={{fontSize: 17}}>{this.state.education[1]}</Text>
            <MaterialIcons name="lightbulb" color="blue" size={24} style={{marginTop: 20}}/>
            <Text style={{fontWeight:"bold", fontSize:18}}>Skills and Proficiencies</Text>
            <Text style={{marginTop:5, fontSize: 17}}>{this.state.skills[3]}</Text>

            <View style={{marginTop: 5, marginBottom: 5}}>
            <Button
              title="Edit user data"
              onPress={() => this.setState({ editData: true })}
            ></Button>
            </View>
          </View>
          <TouchableOpacity
            style={{ paddingVertical: 15 }}
            onPress={() => this.logout(replace)}
          >
            <Text style={{ color: "#d8412e", alignSelf: "center" }}>
              Logout
            </Text>
          </TouchableOpacity>
          </ScrollView>
        </View>
      );
    }
  }
}