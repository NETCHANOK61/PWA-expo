import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

export const DropdownField = ({ items, value, onChange, placeholder }) => (
  <DropDownPicker
    items={items}
    value={value}
    setValue={onChange}
    placeholder={placeholder}
    containerStyle={{ marginBottom: 12 }}
    zIndex={5000}
  />
);
