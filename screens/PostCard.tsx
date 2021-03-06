import React, { useState, useEffect }  from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { Card } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import Profile from './Profile';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IAppState } from '../redux/store';
import Post from '../models/Post';
import { Pressable } from 'react-native';

const PostCard = (props: any) => {
    const navigation = useNavigation();
    const user = useSelector((state: IAppState) => state.user);
    const userName = useSelector((state: IAppState) => state.user?.userName);
    const token = useSelector((state: IAppState) => state.auth.AccessToken);
 
        const item = {
            comments: props.item.comments.L,
            timeStamp: props.item.dataKey.S,
            dataType: props.item.dataType.S,
            displayImg: props.item.displayImg.S,
            displayName: props.item.displayName.S,
            likes: props.item.likes.SS || [],
            postBody: props.item.postBody.S,
            userName: props.item.userName.S
        }
    

    const[likes, setLikes] = useState(item.likes.length);

    const [isLiked, setLikedState] = useState(item.likes.includes(userName));

    //On press of delete post 
    //Will need to refresh feeds at their respective sources
    const deletePost = async () => {
        await axios.delete(`https://w822121nz1.execute-api.us-east-2.amazonaws.com/Prod/post/${item.timeStamp}`, {
            headers: {
                Authorization: token
            }
        }).then(resp => {
            //Response will return deleted post...
            console.log(resp.data[0]);
            props.deletePost();
        })

    }

    const toggleLike = async () => {
        try {
            
            setLikedState(!isLiked);
            
            if (isLiked) setLikes(likes - 1);
            else setLikes(likes + 1);
            await axios.patch(`https://w822121nz1.execute-api.us-east-2.amazonaws.com/Prod/post/${item.timeStamp}`, {
                isLiked: isLiked,
                userName: userName,
                timeStamp: item.timeStamp
            }, {
                headers: {
                    Authorization: token
                }
            })
        } catch (err) {
            console.log(err);
            console.log(err.response.data);
        }



    }

    const redirectToExtendedPostScreen = () => {
        navigation.navigate("ExpandedPost", item)
    }

    const renderNumOfComments = () => {

        const { comments } = props.item;
        if (comments.length) {

        } else {
            const comments = item.comments;
            if(comments.length){
                return comments.length;
            } else {
                return '';
            }
        }

       
    }

    const renderNumOfLikes = () => {
        if (likes - 1) {
            return likes - 1;
        } else {
            return '';
        }
    }

    const renderProfileImageOrDefault = () => {
        const { displayImg } = item;
        if (!displayImg) {
            return (
                <Image
                    source={require('../assets/images/illuminati.png')}
                    style={styles.defaultProfileImage}
                />
            )
        } else {
            return (
                <Image
                    source={{ uri: `${displayImg}` }}
                    style={styles.profileImage}
                />
            )
        }
    }

    const renderNotLikeOrLiked = () => {
        if (isLiked) {
            return (
                <Image
                    source={require('../assets/images/likedIcon.png')}
                    style={styles.heart}
                />)
        } else {
            return (<Image
                source={require('../assets/images/likeIcon.png')}
                style={styles.heart}
            />)
        }
    }

    const determineIfCurrentUser = () => {
        if(user?.userName === item.userName) { return true; }
        else { return false; }
    }


    const postTime = new Date(Number(item.timeStamp));
    const timeText = `${postTime.getHours()}:${postTime.getMinutes()} ${postTime.getDate()}`

    return (
        <View
            style={styles.card}
        >

            <Card containerStyle={styles.cardActual}>

            <View style={styles.wrapperToContainerHeadOfCard}>
                <View
                    style={styles.containerHeadOfCard}
                >
                    <View style={styles.imageContainer}>
                        {renderProfileImageOrDefault()}
                    </View>


                    <View style={styles.nameContainer}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Profile", {displayName: item.displayName, userName: item.userName})}
                        >
                            <Text
                                style={styles.displayName}
                            >{item.displayName}</Text>
                        </TouchableOpacity>


                        <Text
                            style={styles.username}
                        >{`@${item.userName}`}</Text>
                    </View>


                </View>
                    <View>
                        { determineIfCurrentUser() &&
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                            <Pressable 
                                onPress= { () => deletePost()}>
                             <Image
                                source={require('../assets/images/trash-can-icon.png')}
                                style={styles.trashCanContainer}
                             />
                            </Pressable> 
                        </View>
                        }
                    </View>
             </View>
                <View style={styles.postContainer}>
                    <Text
                        style={styles.postBody}
                    >{item.postBody}</Text>
                </View>


                <View
                    style={styles.containerViewAlignIcons}
                >
                    <View style={styles.likesContainer}>
                        <TouchableOpacity onPress={ toggleLike }>
                        {renderNotLikeOrLiked()}
                        </TouchableOpacity>

                        <Text style={styles.likesText}>{renderNumOfLikes()}</Text>
                    </View>

                    <View style={styles.commentsContainer}>
                       <TouchableOpacity 
                        onPress= { () => redirectToExtendedPostScreen()}>
                        <Image
                            source={require('../assets/images/commentIcon.png')}
                            style={styles.comment}
                        />
                        </TouchableOpacity> 
                        <Text style={styles.likesText}>
                            {renderNumOfComments()}
                        </Text>
                    </View>

                    <View style={styles.timeStampContainer}>
                        <Text style={styles.timestamp}>{postTime.toLocaleTimeString() + ' ' + postTime.toLocaleDateString()}</Text>
                    </View>
                </View>
            </Card>

        </View>
    )
}

export default PostCard;

const styles = StyleSheet.create({
    card: {
        padding: 10,
    },
    cardActual: {
        flex: 2,
        borderRadius: 10,
        borderColor: 'purple',
        borderWidth: 2,
        backgroundColor: 'rgb(33, 37, 41)',
    },
    containerHeadOfCard: {
        flex: 1,
        flexDirection: "row",
        marginBottom: 10
    },
    wrapperToContainerHeadOfCard: {
        flex: 1,
        flexDirection: "row",
    },
    imageContainer: {
        flex: 1,
        paddingRight: 10,
    },

    nameContainer: {
        flex: 2,
    },

    postContainer: {
        flex: 2,
        borderRadius: 20,
    },

    containerViewAlignIcons: {
        flex: 1,
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        borderTopWidth: 2,
        borderColor: "purple"
    },
    defaultProfileImage: {
        marginTop: 5,
        width: 90,
        height: 90,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'purple',
        backgroundColor: 'purple'
    },
    profileImage: {
        marginTop: 5,
        width: 90,
        height: 90,
        borderRadius: 100,
        borderWidth:2,
        borderColor:'purple',
        backgroundColor:'purple'
    },
    displayName: {
        fontSize: 22,
        color: "white",
        fontFamily: "BadScript"
    },
    username: {
        fontSize: 16,
        color: "white",
        fontFamily: "BadScript",
    },
    postBody: {
        color: "white",
        fontFamily: "Montserrat",
        marginBottom: 10
    },
    trashCanContainer: {
        width: 25,
        height: 25
    },
    heart: {
        width: 25,
        height: 25
    },
    comment: {
        width: 25,
        height: 25,
    },

    timestamp: {
        color: "white",
        fontFamily: "Montserrat"
    },

    likesText: {
        color: "white",
        paddingLeft: 10,
        fontFamily: "Montserrat"
    },

    likesContainer: {
        flex: 1,
        flexDirection: "row",
    },

    commentsContainer: {
        flex: 1,
        flexDirection: "row"
    },

    timeStampContainer: {
    },
})
