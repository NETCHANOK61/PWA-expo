import React from 'react';
import { View, Text, TextInput } from 'react-native';

export const InputNormal = ({ label, value, onChange, keyboardType = 'default' }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={{ marginBottom: 4 }}>{label}</Text>
    <TextInput
      style={{ padding: 10, borderWidth: 1, borderRadius: 4 }}
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
    />
  </View>
);
