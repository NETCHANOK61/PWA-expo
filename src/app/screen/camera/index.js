import { useDispatch } from "react-redux";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
import LoadingSpinner from "../../components/loading-spinner/loading-spinner";

import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as cameraAction from "../../actions/camera/CameraAction";

import styles from "./Style";

export default function App(props) {
  const dispatch = useDispatch();
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [zoom, setZoom] = useState(0);
  const [autoFocus, setAutoFocus] = useState("on");
  const [whiteBalance, setWhiteBalance] = useState("auto");
  const [imageSEQ, setImageSEQ] = useState(0);
  const [imageType, setImageType] = useState("");
  const [visibleLoading, setVisibleLoading] = useState(false);

  const [comment, setComment] = useState({
    comment_1: "",
    comment_2: "",
    comment_3: "",
  });

  const [permission, requestPermission] = useCameraPermissions();
  // const [photo, setPhoto] = useState(null);

  const cameraRef = useRef(null);

  const init = async () => {
    setImageSEQ(props.route.params.ImageSEQ);
    setImageType(props.route.params.ImageType);
    setComment((current) => ({
      ...current,
      comment_1: props.route.params.comment_1,
      comment_2: props.route.params.comment_2,
      comment_3: props.route.params.comment_3,
    }));

    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera access is required to use this feature.");
    }

    // Permissions.check("photo").then((response) => {
    //   setPermission(response);
    // });
  };

  useEffect(() => {
    init();
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    if (cameraRef) {
      setVisibleLoading(true);
      const options = { quality: 1, doNotSave: false };
      await cameraRef.current
        .takePictureAsync(options)
        .then(async (data) => {
          // Resize the image using Expo ImageManipulator
          try {
            const resizedImage = await ImageManipulator.manipulateAsync(
              data.uri,
              [{ resize: { width: 720, height: 960 } }],
              { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
            );

            // Check if resizedImage is valid
            if (resizedImage && resizedImage.uri) {
              // Read the resized image as base64 using Expo FileSystem
              let base64Image = await FileSystem.readAsStringAsync(
                resizedImage.uri,
                {
                  encoding: FileSystem.EncodingType.Base64,
                }
              );

              setTimeout(() => {
                setVisibleLoading(false);
                dispatch(
                  cameraAction.setPhoto(
                    base64Image,
                    imageSEQ,
                    imageType,
                    comment
                  )
                );
                props.navigation.goBack();
              }, 200);
            } else {
              console.error("Image resizing failed, no URI found.");
            }
          } catch (error) {
            console.error("Error resizing image: ", error);
          }
        })
        .catch((err) => console.error("Error taking picture: ", err));
    }
    // if (cameraRef.current) {
    //   const photo = await cameraRef.current.takePictureAsync();
    //   setPhoto(photo.uri);
    // }
  }

  const flashModeOrder = {
    off: "on",
    on: "auto",
    auto: "torch",
    torch: "off",
  };

  const wbOrder = {
    auto: "sunny",
    sunny: "cloudy",
    cloudy: "shadow",
    shadow: "fluorescent",
    fluorescent: "incandescent",
    incandescent: "auto",
  };

  const toggleFlash = () => {
    setFlash(flashModeOrder[flash]);
  };

  const toggleWB = () => {
    setWhiteBalance(wbOrder[whiteBalance]);
  };

  const toggleFocus = () => {
    setAutoFocus(autoFocus === "on" ? "off" : "on");
  };

  const zoomOut = () => {
    // console.log(zoom)
    setZoom(zoom - 0.1 < 0 ? 0 : zoom - 0.1);
  };

  const zoomIn = () => {
    // console.log(zoom)
    setZoom(zoom + 0.1 > 1 ? 1 : zoom + 0.1);
  };

  return (
    <View style={[styles.container, { paddingTop: "10%" }]}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        flash={flash}
        zoom={zoom}
      >
        <View
          style={{
            flex: 0.5,
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            style={styles.flipIcon}
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <FontAwesome
              active
              name="arrow-left"
              style={{ color: "white", fontSize: 0.06 * viewportWidth }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flipIcon}
            onPress={() => {
              toggleCameraFacing();
            }}
          >
            <FontAwesome
              name="refresh"
              type="FontAwesome"
              style={{ color: "white", fontSize: 0.06 * viewportWidth }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flipIcon}
            onPress={() => {
              toggleFlash();
            }}
          >
            <Ionicons
              name="flash"
              type="Ionicons"
              style={{ color: "white", fontSize: 0.06 * viewportWidth }}
            />
            <Text style={styles.flipText}> {flash} </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flipIcon}
            onPress={() => {
              toggleFocus();
            }}
          >
            <MaterialIcons
              name="center-focus-strong"
              style={{ color: "white", fontSize: 0.06 * viewportWidth }}
            />
            <Text style={styles.flipText}> {autoFocus} </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipIcon}
            onPress={() => {
              toggleWB();
            }}
          >
            <FontAwesome
              name="magic"
              style={{
                color: "white",
                fontSize: 0.06 * viewportWidth,
              }}
            />
            <Text style={styles.flipText}> {whiteBalance}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0.4,
            backgroundColor: "transparent",
            flexDirection: "row",
            alignSelf: "flex-end",
          }}
        ></View>
        <LoadingSpinner
          width={0.75 * viewportWidth}
          height={0.18 * viewportHeight}
          visible={visibleLoading}
          textContent="กำลังโหลด"
          color={"#0000ff"}
        />
        <View
          style={{
            flex: 0.3,
            backgroundColor: "transparent",
            flexDirection: "row",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.1, alignSelf: "flex-end" }]}
            onPress={() => {
              zoomIn();
            }}
          >
            {/* <Text style={styles.flipText}> + </Text> */}
            <MaterialIcons
              name="zoom-in"
              type="MaterialIcons"
              style={{ color: "white", fontSize: 0.09 * viewportWidth }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonTakecamera,
              { flex: 0.3, alignSelf: "flex-end" },
            ]}
            onPress={() => {
              takePicture();
            }}
          >
            <Image
              source={require("../../assets/images/btn_takecamera.png")}
              style={styles.btnImg}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.1, alignSelf: "flex-end" }]}
            onPress={() => {
              zoomOut();
            }}
          >
            {/* <Text style={styles.flipText}> - </Text> */}
            <MaterialIcons
              name="zoom-out"
              type="MaterialIcons"
              style={{ color: "white", fontSize: 0.09 * viewportWidth }}
            />
          </TouchableOpacity>
        </View>
        {/* {photo && <Image source={{ uri: photo }} style={styles.preview} />} */}
        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View> */}
      </CameraView>
    </View>
  );
}
