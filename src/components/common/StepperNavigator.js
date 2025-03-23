import React from 'react';
import { Stepper, Step, StepLabel, styled, useTheme, Paper } from '@mui/material';

// Custom styled components for the stepper
const CustomStepLabel = styled(StepLabel)(({ theme }) => ({
  '& .MuiStepLabel-label': {
    fontWeight: 500,
    fontSize: '0.925rem',
    
    '&.Mui-active': {
      fontWeight: 600,
      color: theme.palette.primary.main,
    },
    '&.Mui-completed': {
      fontWeight: 600,
      color: theme.palette.success.main,
    },
  },
}));

const StepperNavigator = ({
  steps,
  activeStep
}) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={2}
      sx={{ 
        borderRadius: 2,
        p: { xs: 2, md: 3 },
        mb: 4,
        width: '100%'
      }}
    >
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        sx={{
          '& .MuiStepConnector-line': {
            height: 2,
            borderTopWidth: 2,
          },
          '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
            borderColor: theme.palette.primary.main,
          },
          '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            borderColor: theme.palette.success.main,
          },
        }}
      >
        {steps.map((label, index) => (
          <Step 
            key={label}
            completed={activeStep > index}
          >
            <CustomStepLabel
              StepIconProps={{
                sx: {
                  width: 35,
                  height: 35,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  '&.Mui-active': {
                    color: theme.palette.primary.main,
                  },
                  '&.Mui-completed': {
                    color: theme.palette.success.main,
                  },
                }
              }}
            >
              {label}
            </CustomStepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default StepperNavigator; 