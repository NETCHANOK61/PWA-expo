import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export const DateTimeField = ({ label, value, onChange, mode = 'date' }) => {
  const [isVisible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ marginBottom: 4 }}>{label}</Text>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text style={{ padding: 10, borderWidth: 1, borderRadius: 4 }}>
          {value.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isVisible}
        mode={mode}
        date={value}
        onConfirm={(date) => {
          onChange(date);
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />
    </View>
  );
};
