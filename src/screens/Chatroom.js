import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {SHeight, SWidth} from '../utils/Constants';
import {GiftedChat, Actions} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import ImageView from 'react-native-image-viewing';
import storage from '@react-native-firebase/storage';
const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(null);
  const [imageURI, setImageURI] = useState([]);
  const [selectedImageView, setSeletedImageView] = useState('');
  var sender = 1;
  var receiver = 2;
  const getAllMessages = async () => {
    const docid = sender.toString() + '-' + receiver.toString();
    const querySnap = await firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get();
    const allmsg = querySnap.docs.map(docSnap => {
      setImages(docSnap.data().image);
      console.log(docSnap.data().image);
      return {
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      };
    });
    setMessages(allmsg);
  };
  useEffect(() => {
    getAllMessages();
  }, []);
  const onSend = messages => {
    console.log(messages);
    const msg = messages[0];
    const mymsg = {
      ...msg,
      sendBy: sender,
      sendTo: receiver,
      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    firestore()
      .collection('chatrooms')
      .doc(sender.toString() + '-' + receiver.toString())
      .collection('messages')
      .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});
  };

  const openGallery = async => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(images => {
      setImages(images.path);
      console.log('1');
      uploadImage(images.path);

      // const mymsg = {
      //   user: {
      //     _id: sender,
      //   },
      //   sendBy: sender,
      //   sendTo: receiver,
      //   createdAt: new Date(),
      //   imaage: imageURI,
      // };
      // setMessages(previousMessages =>
      //   GiftedChat.append(previousMessages, mymsg),
      // );
      // firestore()
      //   .collection('chatrooms')
      //   .doc(sender.toString() + '-' + receiver.toString())
      //   .collection('messages')
      //   .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});
      // const mymsg = {
      //   ...msg,
      //   text: '',
      //   sendBy: sender,
      //   sendTo: receiver,
      //   createdAt: new Date(),
      //   image: imageURI,
      // };
      // setMessages(previousMessages =>
      //   GiftedChat.append(previousMessages, mymsg),
      // );
      // firestore()
      //   .collection('chatrooms')
      //   .doc(sender.toString() + '-' + receiver.toString())
      //   .collection('messages')
      //   .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});
    });
  };
  const uploadImage = async img => {
    const reference = storage().ref('black-t-shirt-sm.png' + Date.now());
    console.log('2', img);
    await reference.putFile(img);
    const downloadURL = await reference.getDownloadURL();
    console.log('haris ahmed');
    const mymsg = {
      _id: Date.now(),
      user: {
        _id: sender,
      },
      text: '',
      sendBy: sender,
      sendTo: receiver,
      createdAt: new Date(),
      image: downloadURL,
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    firestore()
      .collection('chatrooms')
      .doc(sender.toString() + '-' + receiver.toString())
      .collection('messages')
      .add({
        ...mymsg,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    //This console log works, and actually prints the correct url
  };
  console.log(`Download URL ${imageURI}`);
  return (
    <>
      <GiftedChat
        messages={messages}
        onSend={text => {
          onSend(text);
        }}
        user={{
          _id: 1,
        }}
        renderActions={props => (
          <Actions
            {...props}
            containerStyle={{
              position: 'absolute',
              right: 50,
              bottom: 5,
              zIndex: 9999,
            }}
            // onPressActionButton={handlePhotoPicker}
            icon={() => (
              <View style={{flexDirection: 'row', flex: 1}}>
                <TouchableOpacity
                  style={{width: 500}}
                  onPress={() => openGallery()}>
                  <Text>Camera</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        renderMessageImage={props => {
          return (
            <View style={{borderRadius: 15, padding: 2}}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                  setSeletedImageView(props.currentMessage.image);
                }}>
                <Image
                  resizeMode="contain"
                  style={{
                    width: 200,
                    height: 200,
                    padding: 6,
                    borderRadius: 15,
                    resizeMode: 'cover',
                  }}
                  source={{uri: props.currentMessage.image}}
                />
                {selectedImageView ? (
                  <ImageView
                    imageIndex={0}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                    images={[{uri: selectedImageView}]}
                  />
                ) : null}
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </>
  );
};

export default Chatroom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    width: '50%',
    borderColor: 'orange',
  },
  add: {
    width: 75,
    height: 75,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'tomato',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
