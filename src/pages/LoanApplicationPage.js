import React, { useState, useRef, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Alert, 
  Card, 
  CardContent,
  Divider,
  useTheme,
  Button,
  Snackbar
} from '@mui/material';
import BusinessDetailsForm from '../components/forms/BusinessDetailsForm';
import LoanDetailsForm from '../components/forms/LoanDetailsForm';
import StepperNavigator from '../components/common/StepperNavigator';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import SendIcon from '@mui/icons-material/Send';

const steps = ['Business Details', 'Loan Details'];

const LoanApplicationPage = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const businessFormRef = useRef(null);
  const [applicationData, setApplicationData] = useState({
    businessDetails: {
      businessName: '',
      gstin: '',
      directors: [{ name: '', panNumber: '', tags: [] }]
    },
    loanDetails: {
      creditScore: 750,
      loanAmount: 200000,
      purpose: 'Working Capital',
      tenure: 24,
      collateral: false,
      guarantors: [],
      bankStatements: []
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  useEffect(() => {
    if (submissionError) {
      setToastMessage(submissionError);
      setToastSeverity('error');
      setToastOpen(true);
    }
  }, [submissionError]);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  // Handler for when business details change
  const handleBusinessDetailsChange = (data) => {
    setApplicationData({
      ...applicationData,
      businessDetails: data
    });
    // Clear any error alerts when the user makes changes
    setShowErrorAlert(false);
  };

  // Handler for when loan details change
  const handleLoanDetailsChange = (data) => {
    setApplicationData({
      ...applicationData,
      loanDetails: data
    });
    // Clear any error alerts when the user makes changes
    setShowErrorAlert(false);
  };

  // Specific validation for only GSTIN and PAN number
  const validateGstinAndPan = () => {
    const errors = [];
    
    // Validate GSTIN
    const gstin = applicationData.businessDetails.gstin;
    if (!gstin) {
      errors.push("GSTIN is required");
    } else {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinRegex.test(gstin)) {
        if (!/^[0-9]{2}/.test(gstin)) {
          errors.push("GSTIN must start with 2 digits representing state code");
        } else if (!/^[0-9]{2}[A-Z]{5}/.test(gstin)) {
          errors.push("GSTIN must have 5 uppercase letters after state code");
        } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}/.test(gstin)) {
          errors.push("GSTIN must have 4 digits after the letters");
        } else if (!gstin.includes('Z')) {
          errors.push("GSTIN must contain 'Z'");
        } else {
          errors.push("Invalid GSTIN format. Example: 22AAAAA0000A1Z5");
        }
      }
    }
    
    // Validate PAN for each director
    if (applicationData.businessDetails.directors && applicationData.businessDetails.directors.length > 0) {
      applicationData.businessDetails.directors.forEach((director, index) => {
        const panNumber = director.panNumber;
        if (!panNumber) {
          errors.push(`Director ${index + 1}'s PAN Number is required`);
        } else {
          const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
          if (!panRegex.test(panNumber)) {
            if (!/^[A-Z]{5}/.test(panNumber)) {
              errors.push(`Director ${index + 1}'s PAN must start with 5 uppercase letters`);
            } else if (!/^[A-Z]{5}[0-9]{4}/.test(panNumber)) {
              errors.push(`Director ${index + 1}'s PAN must have 4 digits after the first 5 letters`);
            } else {
              errors.push(`Director ${index + 1}'s PAN must end with an uppercase letter. Example: ABCDE1234F`);
            }
          }
        }
      });
    } else {
      errors.push('At least one director with a valid PAN Number is required');
    }
    
    return errors;
  };

  // Handle next button click
  const handleNext = () => {
    if (activeStep === 0) {
      // Use the ref to validate GSTIN and PAN numbers
      if (businessFormRef.current) {
        const isValid = businessFormRef.current.validateGstinAndPan();
        if (!isValid) {
          // Don't proceed if validation fails
          return;
        }
      } else {
        // Fallback validation if ref is not available
        const validationErrors = validateGstinAndPan();
        
        if (validationErrors.length > 0) {
          setFormErrors(validationErrors);
          setShowErrorAlert(true);
          return;
        }
      }
    }
    // We only validate GSTIN and PAN in the first step
    // Second step doesn't need validation
    
    // Proceed to next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // Clear any previous errors
    setShowErrorAlert(false);
    setFormErrors([]);
  };

  // Handle back button click
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // Clear any error alerts when navigating back
    setShowErrorAlert(false);
  };

  // Handle submit button click
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      
      // Simulating API call with a timeout
      // In production, this would be a real API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Log the data being submitted
      console.log('Submitting application:', applicationData);
      
      // Here you would typically make an API call to submit the data
      // For example:
      // const response = await fetch('https://api.example.com/loan-applications', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(applicationData),
      // });
      //
      // if (!response.ok) {
      //   throw new Error(`API error: ${response.status}`);
      // }
      
      // Success - set as submitted
      setApplicationSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmissionError('Failed to submit application. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Display a thank you message after submission
  if (applicationSubmitted) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Box sx={{ 
          maxWidth: 800, 
          mx: 'auto', 
          mt: 2,
          p: { xs: 2, sm: 4 },
          background: `linear-gradient(45deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center',
          mb: 4
        }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Application Submitted!
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Your loan request is being processed
          </Typography>
        </Box>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'white'
          }}
        >
          <Alert 
            severity="success" 
            sx={{ 
              mb: 4, 
              py: 2,
              borderRadius: 2
            }}
            variant="filled"
          >
            Your loan application has been submitted successfully!
          </Alert>
          
          <Typography variant="h5" gutterBottom fontWeight={500}>
            Thank you for your application
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            We have received your loan application with validated GSTIN and PAN details. We will process it shortly. You will receive a confirmation email with further details.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Application reference number: {Math.random().toString(36).substring(2, 10).toUpperCase()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submission date: {new Date().toLocaleDateString()}
            </Typography>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, pb: 10 }}>
      <Card 
        elevation={0} 
        sx={{ 
          mb: 4, 
          bgcolor: theme.palette.primary.main, 
          color: 'white',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Loan Application Form
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Complete this application to apply for a business loan
          </Typography>
        </CardContent>
      </Card>
      
      {/* Stepper at the top - no navigation buttons */}
      <Box sx={{ mb: 4 }}>
        <StepperNavigator 
          steps={steps} 
          activeStep={activeStep} 
        />
      </Box>
      
      {/* Display validation errors */}
      {showErrorAlert && formErrors.length > 0 && (
        <Alert 
          severity="error" 
          sx={{ mb: 4, mt: 2 }}
          onClose={() => setShowErrorAlert(false)}
        >
          <Typography variant="subtitle2">
            Please fix the following errors:
          </Typography>
          <ul style={{ marginTop: 8, paddingLeft: 20 }}>
            {formErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}
      
      {/* Display current step content */}
      {activeStep === 0 && (
        <>
          <BusinessDetailsForm 
            ref={businessFormRef}
            formData={applicationData.businessDetails}
            onChange={handleBusinessDetailsChange}
            onSubmit={handleNext}
          />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            mt: 4,
            mb: 6
          }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleNext}
              endIcon={<NavigateNextIcon />}
              size="large"
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': {
                }
              }}
            >
              Next
            </Button>
          </Box>
        </>
      )}
      
      {activeStep === 1 && (
        <>
          <LoanDetailsForm 
            formData={applicationData.loanDetails}
            onChange={handleLoanDetailsChange}
            onSubmit={handleSubmit}
          />
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 4,
            mb: 6
          }}>
            <Button 
              variant="outlined" 
              onClick={handleBack} 
              startIcon={<NavigateBeforeIcon />}
              size="large"
              sx={{
                borderRadius: '8px',
                px: 3,
                py: 1.5
              }}
            >
              Back
            </Button>
            
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSubmit}
              endIcon={<SendIcon />}
              size="large"
              disabled={isSubmitting}
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Box>
        </>
      )}
      
      {/* Toast notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleToastClose} 
          severity={toastSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoanApplicationPage; 