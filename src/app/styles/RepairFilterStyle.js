import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");
const aspectRatio = height / width;
export default StyleSheet.create({
  space: {
    height: 0.02 * height,
  },
  btn_srh: {
    backgroundColor: "#2c689e",
    height: 35,
    borderRadius: 10,
    borderColor: "#2c689e",
    marginTop: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn_rem: {
    backgroundColor: "#ec407a",
    height: 35,
    borderRadius: 10,
    borderColor: "#ec407a",
    marginTop: 20,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  panalPiker: {
    borderColor: "#2c689e",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  iconPikker: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 20,
  },
  picker: {
    width: 0.9 * width,
    height: 0.05 * height,
    color: "white",
    backgroundColor: "transparent",
  },
  textInputMultiImage: {
    fontFamily: "Prompt-Regular",
    borderWidth: 1,
    borderColor: "#DDD",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 0.04 * width,
    width: "100%",
    ...Platform.select({
      ios: {
        textAlignVertical: "top",
        height: 50,
      },
      android: {
        textAlignVertical: "top",
        height: 50,
      },
    }),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconCalendar: {
    width: aspectRatio > 1.6 ? 0.1 * width : 0.05 * width,
    height: aspectRatio > 1.6 ? 0.03 * height : 0.035 * height,
    tintColor: "rgba(0,0,0,0.2)",
  },
  btnCalendar: {
    position: "absolute",
    top: aspectRatio > 1.6 ? 0.01 * height : 0.017 * height,
    right: 10,
    ...Platform.select({ android: { top: 3, padding: 0 } }),
    padding: 0,
  },
  textInput: {
    fontFamily: "Prompt-Regular",
    fontSize: 0.02 * height,
    borderRadius: 5,
    width: "100%",
    height: 0.05 * height,
    paddingHorizontal: 10,
    ...Platform.select({
      android: { paddingVertical: 0, color: "black", fontFamily: "Prompt-Regular" },
    }),
  },
  input: {
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderColor: "#2c689e",
    borderWidth: 1,
  },
});
