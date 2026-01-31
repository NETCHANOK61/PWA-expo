import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import workSurveyStyle from '../../styles/WorkSurveyStyle';
import * as workSurveyAction from '../../actions/jobsurvey/WorkSurveyAction';

const { width: viewportWidth } = Dimensions.get('window');

export default function WorkSurveyScreen(props) {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const workRepairDetailReducer = useSelector(
    state => state.workRepairDetailReducer
  );

  const [colorPoint, setColorPoint] = useState('#999');

  const survey = workRepairDetailReducer.dataArray?.survey;
  const process = workRepairDetailReducer.dataArray?.process ?? {
    files1: { files: [], count: 0 },
    files2: { files: [], count: 0 },
    files3: { files: [], count: 0 },
    files4: { files: [], count: 0 },
    files5: { files: [], count: 0 },
  };
  useEffect(() => {
    if (isFocused) {
      getInitial();
    }
  }, [isFocused]);

  const getInitial = () => {
    if (survey?.latitude && survey?.longtitude) {
      setColorPoint('green');
    } else {
      setColorPoint('#999');
    }
  };

  const tarGetTakePhoto = (key, files) => {
    const data = workRepairDetailReducer.dataArray;
    if (key === 'point') {
      props.navigation.navigate('Savelocation', {
        rwId: data?.rwId,
        rwCode: data?.rwCode,
        data: props.data,
      });
    } else {
      dispatch(workSurveyAction.workSurveyTargetImage(key));
      props.navigation.navigate('WorkTakePhotoScreen', {
        rwId: data?.rwId,
        rwCode: data?.rwCode,
        no: key,
        image: files,
      });
    }
  };

  if (!workRepairDetailReducer.dataArray || !survey) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3a405a" />
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView scrollEnabled={false}>
        <View style={workSurveyStyle.section}>
          {/* จุดซ่อม */}
          <View style={workSurveyStyle.row}>
            <TouchableOpacity
              style={{
                backgroundColor: colorPoint,
                borderRadius: 5,
                width: '49%',
                alignItems: 'center',
              }}
              onPress={() => tarGetTakePhoto('point', [])}
            >
              <MaterialCommunityIcons
                name="map-marker-radius-outline"
                style={{
                  fontSize: 0.13 * viewportWidth,
                  marginTop: 20,
                  color: '#FFF',
                }}
              />
              <Text style={workSurveyStyle.label5}>ลงจุดซ่อม</Text>
            </TouchableOpacity>
            <View style={{ width: '2%' }} />
            {renderPhotoButton('1', 'ก่อนซ่อม', process.files1)}
          </View>

          <View style={workSurveyStyle.row}>
            {renderPhotoButton('2', 'เตรียมการก่อนซ่อม', process.files2)}
            <View style={{ width: '2%' }} />
            {renderPhotoButton('3', 'ระหว่างซ่อม', process.files3)}
          </View>

          <View style={workSurveyStyle.row}>
            {renderPhotoButton('4', 'เก็บงานคืนซ่อม', process.files4)}
            <View style={{ width: '2%' }} />
            {renderPhotoButton('5', 'หลังซ่อม', process.files5)}
          </View>
        </View>
      </ScrollView>
    </View>
  );

  function renderPhotoButton(key, label, fileGroup) {
    const isCompleted = fileGroup?.count >= 3;
    return (
      <TouchableOpacity
        style={{
          backgroundColor: isCompleted ? 'green' : '#999',
          borderRadius: 5,
          width: '49%',
          alignItems: 'center',
        }}
        onPress={() => tarGetTakePhoto(key, fileGroup?.files || [])}
      >
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <FontAwesome5
            name="image"
            style={{
              color: '#FFF',
              fontSize: 0.15 * viewportWidth,
            }}
          />
          <Text style={workSurveyStyle.label4}>
            {fileGroup?.count ?? '0'}
          </Text>
        </View>
        <Text style={workSurveyStyle.label3}>{label}</Text>
      </TouchableOpacity>
    );
  }
}
