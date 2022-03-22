import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator,TextInput } from 'react-native'
import { unit, width } from './ScreenDetails';

export default function PostList(props) {
    const [page, setpage] = React.useState(1);
    const [totalPage, setTotalPage] = React.useState(0);
    const [userData, setUserData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isAdd, setIsAdd] = React.useState(false);
    const [title, setTitle] = React.useState('');
    const [body, setBody] = React.useState('');
    const token = 'b502524948a4a8b7320c2f9c5b6a2c42057aa0d727078497cb3cf24f0eccdba9';
    function onChangeTitle(text) {
        setTitle(text);
    }
    function onChangeBody(text) {
        setBody(text);
    }
    React.useEffect(() => {
        api();
    }, []);
    async function api() {
        console.log(props.route.params.id);
        setIsLoading(true);
        new Promise((resolve, reject) => {
            fetch(`https://gorest.co.in/public/v1/posts?user_id=${props.route.params.id}`, {
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
    function insertPost() {
        if(title !='' && body !=''){
            setIsLoading(true);
            new Promise((resolve, reject) => {
                fetch(`https://gorest.co.in/public/v1/posts?&access-token=${token}`, {
                    method: 'post',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: title,
                        body: body,
                        user_id: props.route.params.id
                    })

                })
                    .then((response) => response.json())
                    .then((responseData) => {
                        if (responseData.Error) {
                            alert("Errore");
                        }
                        resolve(responseData)
                        let temp = [responseData.data];
                        temp.push(...userData);
                        setUserData(temp)
                        setTitle('');
                        setBody('');
                        setIsLoading(false);
                    })
                    .catch((err) => { reject(err) })
            })
            setIsAdd(false)
        }else{
            alert("Enter Both Details")
        }
    }
    function onEndScroll() {
        if (!isLoading && totalPage > page) {
            setpage(page + 1);
            api();
        }
    }
    return (
        <View style={styles.container}>
            {
                userData.length !=0 ?
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
                                <TouchableOpacity
                                    style={styles.queView}
                                    onPress={() => props.navigation.navigate("PostCommet", { user_id: props.route.params.id, post_id: item.id, name: props.route.params.name, email: props.route.params.email})}
                                >
                                    <Text style={styles.titleText}>{"Title: " + item.title}</Text>
                                    <Text style={styles.subTitleText}>{"Body: " + item.body}</Text>
                                </TouchableOpacity>
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
                isAdd ?
                    <View>
                        <Text style={styles.title}>Add Post</Text>
                        <TextInput
                            style={styles.textFeild}
                            placeholder='Title' commet
                            placeholderTextColor={'black'}
                            onChangeText={(text) => onChangeTitle(text)}
                            defaultValue={title}
                        />
                        <TextInput
                            style={styles.textFeild}
                            placeholder='Body'
                            placeholderTextColor={'black'}
                            onChangeText={(text) => onChangeBody(text)}
                            defaultValue={body}
                        />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={() => insertPost()}
                        >
                            {
                                isLoading ?
                                    <ActivityIndicator style={{ marginVertical: 10 }} />
                                    :
                                    <Text style={styles.btnText}>Submit</Text>
                            }
                        </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity
                        style={styles.addBTN}
                        onPress={() => setIsAdd(true)}
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
        paddingBottom: 20 * unit
    },
    card: {
        marginHorizontal: 15 *unit,
        padding: 15 * unit,
        marginTop: 10 * unit,
        borderRadius: 10 * unit,
        borderColor: 'black',
        borderWidth: 1
    },
    addBTN: {
        position: 'absolute',
        bottom: 10 * unit,
        right: 20 * unit,
        height: 30 * unit,
        width: 60 * unit,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20 * unit,
    },
    btnText: {
        color: 'white',
        fontSize: 18 * unit,
        fontWeight: '600'
    },
    textFeild: {
        height: 50,
        backgroundColor: 'lightblue',
        marginHorizontal: 15 * unit,
        borderRadius: 10 * unit,
        marginTop: 10 * unit,
        paddingHorizontal: 20 * unit,
        color: 'black'
    },
    title: {
        fontSize: 25 * unit,
        fontWeight: '600',
        color: 'black',
        textAlign: 'center'
    },
    btn: {
        height: 50,
        backgroundColor: 'blue',
        marginHorizontal: 15 * unit,
        borderRadius: 10 * unit,
        marginTop: 10 * unit,
        paddingHorizontal: 20 * unit,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnText: {
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
        fontWeight: '400',
        color: 'black',
    }
})
