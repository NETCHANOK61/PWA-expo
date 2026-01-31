import {StyleSheet, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export default StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: 'Prompt-Regular',
    color: "#000",
  },
  text_12: {
    fontSize: 12,
    fontFamily: 'Prompt-Regular',
    color: "#000",
  },
  text_13_forgetpass: {
    color: '#fff',
    fontSize: 0.02 * height,
    fontFamily: 'Prompt-Regular',
  },
  text_color_bold: {
    fontSize: 15,
    fontFamily: 'Prompt-Bold',
    color: '#283593',
  },
  text_bold: {
    color: '#272a2f',
    fontSize: 0.03 * width,
    fontFamily: 'Prompt-bold',
  },

  text_bold_color_btn: {
    color: '#FFFFFF',
    fontFamily: 'Prompt-Bold',
    fontSize: 0.025 * height,
  },
  text_bold_12_paddingleft: {
    paddingLeft: 10,
    fontSize: 12,
    fontFamily: 'Prompt-Bold',
    color: "#000",
  },
  text_bold_12: {
    fontSize: 0.015 * height,
    fontFamily: 'Prompt-Bold',
    color: "#000",
  },

  // NEW
  text_sm_regular: {
    fontSize: 0.015 * height,
    fontFamily: 'Prompt-Regular',
    color: "#000",
  },
  text_sm_bold: {
    fontSize: 0.015 * height,
    fontFamily: 'Prompt-Bold',
    color: "#000",
  },
  text_normal_regular: {
    fontSize: 0.02 * height,
    fontFamily: 'Prompt-Regular',
    color: "#000",
  },
  text_normal_bold: {
    fontSize: 0.02 * height,
    fontFamily: 'Prompt-Bold',
    color: "#000",
  },
  text_normal_bold_color_indigo: {
    color: '#3a405a',
    fontSize: 0.02 * height,
    fontFamily: 'Prompt-Bold',
  },
  text_normal_bold_color_blue: {
    color: '#2c689e',
    fontSize: 0.02 * height,
    fontFamily: 'Prompt-Bold',
  },
  text_sm_bold_color_blue: {
    fontSize: 0.015 * height,
    fontFamily: 'Prompt-Bold',
    color: '#2c689e',
  },
  text_sm_center_color: {
    fontSize: 0.015 * height,
    textAlign: 'center',
    fontFamily: 'Prompt-Regular',
    color: '#2c689e',
  },
  text_request: {
    fontSize: 0.025 * height,
    fontFamily: 'Prompt-Bold',
    color: 'red'
  },
  text_xl_bold_color_blue: {
    color: '#2c689e',
    fontSize: 0.025 * height,
    fontFamily: 'Prompt-Bold',
  },
  text_left: {
    textAlign: 'left',
  },
  text_right: {
    textAlign: 'right',
  },
  text_center: {
    textAlign: 'center',
  },
  font_regular: {
    fontFamily: 'Prompt-Regular',
  },
});
