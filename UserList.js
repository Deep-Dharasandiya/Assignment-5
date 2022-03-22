import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { unit } from './ScreenDetails';
export default function UserList(props) {
    const [page, setpage] = React.useState(1);
    const [totalPage,setTotalPage] = React.useState(0);
    const [userData, setUserData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const token = 'b502524948a4a8b7320c2f9c5b6a2c42057aa0d727078497cb3cf24f0eccdba9';
    React.useEffect(() => {
        api();
    }, []);
    async function api() {
        setIsLoading(true);
        new Promise((resolve, reject) => {
            fetch(`https://gorest.co.in/public/v1/users?page=${page},access-token=${token}`, {
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
    function onEndScroll() {
        if (!isLoading && totalPage>page) {
            setpage(page + 1);
            api();
        }
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
                                <TouchableOpacity
                                    style={styles.queView}
                                onPress={() => props.navigation.navigate("PostList",{id:item.id,name:item.name,email:item.email})}
                                >
                                    <Text style={styles.titleText}>{"Name: "+item.name}</Text>
                                    <Text style={styles.subTitleText}>{"Email: "+item.email}</Text>
                                    <Text style={{ color: 'black' }}>{"Gender: " + item.gender}</Text>
                                    <Text style={{ color: 'black' }}>{"Status: " + item.status}</Text>
                                </TouchableOpacity>
                            </View>
                        }}
                    />
                    : !isLoading && (
                        <Text style={{ color: 'black', fontSize: 20, textAlign: 'center' }}>Empty Data</Text>
                    )
            }
            {
                isLoading && (
                    <ActivityIndicator style={{ marginVertical: 10 }} />
                )
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
    titleText:{
        fontSize:20 * unit,
        fontWeight:'600',
        color:'black',
    },
    subTitleText: {
        fontSize: 18 * unit,
        fontWeight: '600',
        color: 'black',
    }
})
