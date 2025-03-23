import React from 'react';
import { FormLabel, styled } from '@mui/material';

const StyledFormLabel = styled(FormLabel)(({ theme }) => ({
  position: 'relative',
  '&.Mui-required': {
    '&::after': {
      content: '" *"',
      color: theme.palette.error.main,
      fontWeight: 'bold',
      marginLeft: '4px',
      position: 'absolute',
    },
    '& .MuiFormLabel-asterisk': {
      display: 'none',
    },
  },
}));

const CustomFormLabel = (props) => {
  return <StyledFormLabel {...props} />;
};

export default CustomFormLabel; 