import React, { forwardRef, useImperativeHandle } from 'react';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';
import { Box, Paper, Typography, Divider, useTheme, Alert, FormHelperText } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import businessDetailsSchema, { businessDetailsUiSchema } from '../../schemas/businessDetailsSchema';

const BusinessDetailsForm = forwardRef(({ formData, onChange, onSubmit }, ref) => {
  const theme = useTheme();
  const [errors, setErrors] = React.useState([]);
  const [fieldErrors, setFieldErrors] = React.useState({
    gstin: '',
    panNumber: ''
  });

  // GSTIN validation function
  const validateGSTIN = (value) => {
    if (!value) return "GSTIN is required";

    // Regular expression for GSTIN validation
    // Format: 2 digits + 5 letters + 4 digits + 1 letter + 1 letter/digit + Z + 1 letter/digit
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!gstinRegex.test(value)) {
      if (!/^[0-9]{2}/.test(value)) {
        return "GSTIN must start with 2 digits representing state code";
      } else if (!/^[0-9]{2}[A-Z]{5}/.test(value)) {
        return "GSTIN must have 5 uppercase letters after state code";
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}/.test(value)) {
        return "GSTIN must have 4 digits after the letters";
      } else if (!value.includes('Z')) {
        return "GSTIN must contain 'Z'";
      } else {
        return "Invalid GSTIN format. Example: 22AAAAA0000A1Z5";
      }
    }

    return "";
  };

  // PAN validation function
  const validatePAN = (value) => {
    if (!value) return "PAN Number is required";

    // Regular expression for PAN validation
    // Format: 5 letters + 4 digits + 1 letter
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!panRegex.test(value)) {
      if (!/^[A-Z]{5}/.test(value)) {
        return "PAN must start with 5 uppercase letters";
      } else if (!/^[A-Z]{5}[0-9]{4}/.test(value)) {
        return "PAN must have 4 digits after the first 5 letters";
      } else {
        return "PAN must end with an uppercase letter. Example: ABCDE1234F";
      }
    }

    return "";
  };

  // Handle specific field validation
  const handleFieldValidation = (field, value) => {
    let error = '';

    if (field === 'gstin') {
      error = validateGSTIN(value);
    } else if (field === 'panNumber') {
      error = validatePAN(value);
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return error === '';
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    validateGstinAndPan: () => {
      // Validate GSTIN
      const gstinError = validateGSTIN(formData.gstin);
      setFieldErrors(prev => ({
        ...prev,
        gstin: gstinError
      }));

      // Validate PAN for directors
      let panError = '';
      let hasValidationError = false;

      if (formData.directors && formData.directors.length > 0) {
        formData.directors.forEach((director, index) => {
          const error = validatePAN(director.panNumber);
          if (error) {
            panError = `Director ${index + 1}: ${error}`;
            hasValidationError = true;
            return false; // Break the loop on first error
          }
        });
      } else {
        panError = "At least one director with a valid PAN is required";
        hasValidationError = true;
      }

      setFieldErrors(prev => ({
        ...prev,
        panNumber: panError
      }));

      return !gstinError && !hasValidationError;
    }
  }));

  const handleChange = (e) => {
    if (e.formData) {
      // Only validate GSTIN and PAN fields, ignore other validations
      if (formData.gstin !== e.formData.gstin) {
        handleFieldValidation('gstin', e.formData.gstin);
      }

      // Check if any director's PAN changed
      if (e.formData.directors && e.formData.directors.length > 0) {
        e.formData.directors.forEach((director, index) => {
          if (!formData.directors ||
            !formData.directors[index] ||
            formData.directors[index].panNumber !== director.panNumber) {
            handleFieldValidation('panNumber', director.panNumber);
          }
        });
      }

      onChange(e.formData);
      // Clear the general errors when user makes changes
      setErrors([]);
    }
  };

  // Handle field blur for validation
  const handleFieldBlur = (field, value) => {
    handleFieldValidation(field, value);
  };

  const handleSubmit = () => {
    onSubmit();
  };

  const handleError = (errors) => {
    // Capture validation errors
    setErrors(errors);
    console.log("Form validation errors:", errors);
  };

  // Custom UI schema with enhanced styling
  const enhancedUiSchema = {
    ...businessDetailsUiSchema,
    'ui:submitButtonOptions': {
      norender: true,
    },
    'ui:classNames': 'business-details-form',
    'ui:options': {
      requiredLabel: true,
    },
    'ui:showTitle': false,
    businessName: {
      'ui:autofocus': true,
      'ui:placeholder': 'Enter your business name',
      'ui:description': 'Legal name of your business as registered',
    },
    gstin: {
      'ui:placeholder': 'e.g. 22AAAAA0000A1Z5',
      'ui:description': 'Your 15-digit Goods and Services Tax Identification Number',
      'ui:errors': {
        pattern: 'GSTIN must be a valid 15-digit number.',
      },
      'ui:options': {
        onBlur: (e) => handleFieldBlur('gstin', e.target.value),
        classNames: fieldErrors.gstin ? 'field-error' : '',
      },
      'ui:widget': 'text',
      'ui:focus': fieldErrors.gstin !== '',
      'ui:help': fieldErrors.gstin && (
        <FormHelperText error>{fieldErrors.gstin}</FormHelperText>
      )
    },
    directors: {
      'ui:description': 'Information about all directors/partners of the business',
      'ui:options': {
        orderable: false,
        removable: false,
        addButtonText: 'Add Another Director'
      },
      items: {
        ...businessDetailsUiSchema.directors?.items,
        'ui:title': 'Director Details',
        name: {
          'ui:placeholder': 'Director\'s full name',
        },
        panNumber: {
          'ui:placeholder': 'e.g. ABCDE1234F',
          'ui:description': 'Permanent Account Number issued by Income Tax Department',
          'ui:errors': {
            pattern: 'PAN number must be a valid format (e.g., ABCDE1234F).',
          },
          'ui:options': {
            onBlur: (e) => handleFieldBlur('panNumber', e.target.value),
            classNames: fieldErrors.panNumber ? 'field-error' : '',
            removable: false,
          },
          'ui:widget': 'text',
          'ui:focus': fieldErrors.panNumber !== '',
          'ui:help': fieldErrors.panNumber && (
            <FormHelperText error>{fieldErrors.panNumber}</FormHelperText>
          )
        },
        tags: {
          'ui:placeholder': 'e.g. CEO, Founder',
          'ui:options': {
            addButtonText: 'Add a Tag',
          }
        }
      }
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        mb: 8,
        borderRadius: 2,
        backgroundColor: 'white',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <BusinessIcon
            color="primary"
            sx={{
              mr: 2,
              fontSize: 28,
            }}
          />
          <Typography variant="h5" component="h2" color="primary.main">
            Business Details
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
          <Typography component="span" fontWeight="bold" color="primary.main">
            Fill all the details with correct information.
          </Typography>
          {' '}Please ensure these details are accurate to proceed with your application.
        </Typography>

        {/* Display GSTIN validation error */}
        {fieldErrors.gstin && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            <Typography variant="body2">
              {fieldErrors.gstin}
            </Typography>
          </Alert>
        )}

        {/* Display PAN validation error */}
        {fieldErrors.panNumber && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            <Typography variant="body2">
              {fieldErrors.panNumber}
            </Typography>
          </Alert>
        )}

        {/* Display validation errors prominently */}
        {errors.length > 0 && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            <Typography variant="subtitle2">
              Please fix the following errors:
            </Typography>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              {errors.map((error, index) => (
                <li key={index} style={{ fontSize: "15px" }}>
                  {/* More robust error display */}
                  {error.stack || error.message ||
                    (error.property ? `${error.property.replace('instance.', '')}: ${error.message}` :
                      JSON.stringify(error))}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        <Form
          schema={businessDetailsSchema}
          uiSchema={enhancedUiSchema}
          validator={validator}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onError={handleError}
          showErrorList={false}
          liveValidate={false}
          focusOnFirstError={true}
          className="business-details-rjsf"
          formContext={{
            isBusinessForm: true,
            validateGSTIN,
            validatePAN,
            fieldErrors
          }}
        />
      </Paper>
    </Box>
  );
});

export default BusinessDetailsForm;