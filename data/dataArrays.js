import React from 'react';
import {Image} from 'react-native';

export const categoriesType = [
  {
    label: 'Vegan',
    value: 'Vegan',
    checked: true,
    disabled: false,
    flexDirection: 'row',
    size: 5,
  },
  {
    label: 'Vegetarion',
    value: 'Vegetarion',
    checked: false,
    disabled: false,
    flexDirection: 'row',
    size: 5,
  },
  {
    label: 'Non-Veg',
    value: 'Non-Veg',
    checked: false,
    disabled: false,
    flexDirection: 'row',
    size: 5,
  },
  {
    label: 'Eggetarian',
    value: 'Eggetarian',
    checked: false,
    disabled: false,
    flexDirection: 'row',
    size: 5,
  },
];

export const onboardingData = [
  {
    backgroundColor: '#a6e4d0',
    image: <Image source={require('../assets/onboarding-img1.png')} />,
    title: 'Connect to the World',
    subtitle: 'A New Way To Connect With The World',
  },
  {
    backgroundColor: '#fdeb93',
    image: <Image source={require('../assets/onboarding-img2.png')} />,
    title: 'Share Your Favorites',
    subtitle: 'Share Your Thoughts With Similar Kind of People',
  },
  {
    backgroundColor: '#e9bcbe',
    image: <Image source={require('../assets/onboarding-img3.png')} />,
    title: 'Become The Star',
    subtitle: 'Let The Spot Light Capture You',
  },
];
