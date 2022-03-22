import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator,TextInput } from 'react-native'
import { unit, width } from './ScreenDetails';

export default function PostCommet(props) {
    const [page, setpage] = React.useState(1);
    const [totalPage, setTotalPage] = React.useState(0);
    const [userData, setUserData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isAdd , setIsAdd]=React.useState(false);
    const [name , setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [commet, setCommet] = React.useState('');
    const token = 'b502524948a4a8b7320c2f9c5b6a2c42057aa0d727078497cb3cf24f0eccdba9';

    function onChangeName(text){
        setName(text);
    }
    function onChangeEmail(text) {
        setEmail(text);
    }
    function onChangeCommet(text){
        setCommet(text);
    }

    React.useEffect(() => {
        api();
    }, []);
    async function api() {
        console.log(props.route.params.id);
        setIsLoading(true);
        new Promise((resolve, reject) => {
            fetch(`https://gorest.co.in/public/v1/comments?post_id=${props.route.params.post_id}&access-token=${token}`, {
                method: 'get',
                headers: {
                    "Content-Type": "application/json",
                },

            })
                .then((response) => response.json())
                .then((responseData) => {
                    if (responseData.Error) {
                        alert("Errore");
                    }
                    resolve(responseData)
                    setTotalPage(responseData.meta.pagination.pages)
                    let temp = userData;
                    temp.push(...responseData.data);
                    setUserData(temp)
                    setIsLoading(false);
                })
                .catch((err) => { reject(err) })
        })
    }
    function insertCommet(){
        if(commet !='' && name!='' && email!=''){
           if(isEmail(email)){
               setIsLoading(true);
               new Promise((resolve, reject) => {
                   fetch(`https://gorest.co.in/public/v1/comments?&access-token=${token}`, {
                       method: 'post',
                       headers: {
                           "Content-Type": "application/json",
                       },
                       body: JSON.stringify({
                           body: commet,
                           name: name,
                           email: email,
                           post_id: props.route.params.post_id
                       })

                   })
                       .then((response) => response.json())
                       .then((responseData) => {
                           if (responseData.Error) {
                               alert("Errore");
                           }
                           if (responseData.hasOwnProperty('field') && responseData.hasOwnProperty('message')){
                               setIsLoading(false);
                               alert(responseData.data.message)
                           }else{
                               resolve(responseData)
                               let temp = [responseData.data];
                               temp.push(...userData);
                               setUserData(temp)
                               setCommet('');
                               setEmail('');
                               setName('');
                               setIsLoading(false);
                           }
                       })
                       .catch((err) => { reject(err) })
               })
               setIsAdd(false)
           }else{
               alert("Please enter valid Email")
           }
        }else{
            alert("Enter All the Details");
        }
    }
    function onEndScroll() {
        
        if (!isLoading && totalPage > page) {
            setpage(page + 1);
            api();
        }
    } 
    function isEmail(val) {
        let isValid = true;
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (val == '') {
            isValid = false;
        } else if (!regex.test(val)) {
            isValid = false;
        }
        return isValid;
    }
    return (
        <View style={styles.container}>
            {
                userData.length !=0?
                    <FlatList
                        key={1}
                        data={userData}
                        listMode="SCROLLVIEW"
                        onEndReached={() => onEndScroll()}
                        keyExtractor={(item, index) => `key-${index}`}
                        ListHeaderComponent={() => (
                            <View></View>
                        )}
                        renderItem={({ item, index }) => {
                            return <View style={styles.card}>
                                <View style={styles.queView}>
                                    <Text style={styles.titleText}>{"Name: " + item.body}</Text>
                                    <Text style={styles.subTitleText}>{"Commet: " + item.body}</Text>
                                    <Text style={{ color: 'black' }}>{"Email: " + item.email}</Text>
                                </View>
                            </View>
                        }}
                    />
                    : !isLoading &&(
                        <Text style={{ color: 'black', fontSize: 20, textAlign: 'center' }}>Empty Data</Text>
                     )
            }
            {
                isLoading && (
                    <ActivityIndicator style={{ marginVertical: 10 }} />
                )
            }
            {
                isAdd?
                <View>
                    <Text style={styles.title}>Add Commet</Text>
                    <TextInput
                        style={styles.textFeild}
                        placeholder='Commet'
                        placeholderTextColor={'black'}
                        onChangeText={(text) => onChangeCommet(text)}
                        defaultValue={commet}
                    />
                    <TextInput
                        style={styles.textFeild}
                        placeholder='Name'
                        placeholderTextColor={'black'}
                        onChangeText={(text) => onChangeName(text)}
                        defaultValue={name}
                    />
                    <TextInput
                        style={styles.textFeild}
                        placeholder='Email'
                        placeholderTextColor={'black'}
                        onChangeText={(text) => onChangeEmail(text)}
                        defaultValue={email}
                    />
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => insertCommet()}
                    >
                        {
                            isLoading?
                                    <ActivityIndicator style={{ marginVertical: 10 }} />
                                    :
                                    <Text style={styles.btnText}>Submit</Text>
                        }
                    </TouchableOpacity>
                </View>
                :
                <TouchableOpacity 
                    style={styles.addBTN}
                    onPress={()=>setIsAdd(true)}
                    >
                    <Text style={styles.btnText}>Add</Text>
                    </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    card: {
        marginHorizontal: 15 * unit,
        padding: 15 * unit,
        marginTop: 10 * unit,
        borderRadius: 10 * unit,
        borderColor: 'black',
        borderWidth: 1
    },
    addBTN:{
        position:'absolute',
        bottom: 10 * unit,
        right: 20 * unit,
        height: 30 * unit,
        width: 60 * unit,
        backgroundColor:'blue',
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 20 * unit,
    },
    btnText:{
        color:'white',
        fontSize: 18 * unit,
        fontWeight:'600'
    },
    textFeild:{
        height: 50 * unit,
        backgroundColor:'lightblue',
        marginHorizontal: 15 * unit,
        borderRadius: 10 * unit,
        marginTop: 10 * unit,
        paddingHorizontal: 20 * unit,
        color:'black'
    },
    title:{
        fontSize: 25 * unit,
        fontWeight:'600',
        color:'black',
        textAlign:'center'
    },
    btn:{
        height: 50 * unit,
        backgroundColor: 'blue',
        marginHorizontal: 15 * unit,
        borderRadius: 10 * unit,
        marginTop: 10 * unit,
        paddingHorizontal: 20 * unit,
        alignItems:'center',
        justifyContent:'center'
    },
    btnText:{
        fontSize: 20 * unit,
        fontWeight: '600',
        color: 'white',
    },
    titleText: {
        fontSize: 20 * unit,
        fontWeight: '600',
        color: 'black',
    },
    subTitleText: {
        fontSize: 18 * unit,
        fontWeight: '600',
        color: 'black',
    }
})
