import React from 'react';
import validator from '@rjsf/validator-ajv8';
import Form from '@rjsf/mui';
import { Box, Paper, Typography, Divider, useTheme, Alert, FormHelperText, LinearProgress } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { loanDetailsSchema, loanDetailsUiSchema } from '../../schemas/loanDetailsSchema';

// Add a global CSS to ensure all form fields and selects take full width
const globalStyles = `
  .MuiFormControl-root, 
  .MuiInputBase-root, 
  .MuiSelect-root,
  .MuiSelect-select,
  .MuiOutlinedInput-root,
  .MuiInputBase-formControl,
  .form-group, 
  .field, 
  .field-string, 
  .field-number, 
  .field-boolean,
  .field-object,
  .field-array,
  .full-width-field,
  [class*="field-"] {
    width: 100% !important;
    max-width: 100% !important;
  }

  .guarantor-relationship-field .MuiFormControl-root,
  .guarantor-relationship-field .MuiInputBase-root,
  .guarantor-relationship-field .MuiSelect-select,
  .guarantor-relationship-field .MuiOutlinedInput-root {
    width: 100% !important;
    max-width: 100% !important;
  }

  select, input, textarea {
    width: 100% !important;
    max-width: 100% !important;
  }
`;

// Custom Field Template to display errors underneath the field
const CustomFieldTemplate = (props) => {
  const { id, label, help, required, description, errors, children, formContext } = props;

  // Extract field name from the id
  const fieldName = id.split('_').pop();
  const isCreditScore = fieldName === 'creditScore';
  const isPanNumber = fieldName === 'panNumber';
  const isRelationship = fieldName === 'relationship';

  // Get the custom validation error for this field if it exists
  let customError = '';
  if (isCreditScore && formContext.fieldErrors?.creditScore) {
    customError = formContext.fieldErrors.creditScore;
  } else if (isPanNumber && formContext.fieldErrors?.panNumber) {
    customError = formContext.fieldErrors.panNumber;
  }

  // Add special class for relationship field
  const fieldClass = isRelationship ? 'guarantor-relationship-field' : '';

  return (
    <div className={`form-group field field-${props.schema.type} ${fieldClass}`} style={{ marginBottom: '16px', width: '100%', maxWidth: '100%' }}>
      <div className="control-label-wrapper">
        {label && (
          <label htmlFor={id} className={required ? 'control-label required' : 'control-label'} style={{ fontSize: '14px', marginBottom: '4px' }}>
            {label}
          </label>
        )}
      </div>

      {description && <div className="field-description" style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>{description}</div>}

      <div style={{ width: '100%', maxWidth: '100%' }}>
        {children}
      </div>

      {/* Show validation error if it exists */}
      {(errors || customError) && (
        <FormHelperText error={true} style={{ marginTop: '4px', fontWeight: 500, fontSize: '12px' }}>
          {customError || errors}
        </FormHelperText>
      )}

      {help && <div className="help-block" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>{help}</div>}
    </div>
  );
};

const LoanDetailsForm = ({ formData, onChange, onSubmit }) => {
  const theme = useTheme();
  const [fieldErrors, setFieldErrors] = React.useState({
    creditScore: '',
    panNumber: ''
  });

  // Credit Score validation function
  const validateCreditScore = (value) => {
    if (!value) return "Credit Score is required";

    if (value < 300 || value > 900) {
      return "Credit Score must be between 300 and 900";
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
      return "Invalid PAN format. Example: ABCDE1234F";
    }

    return "";
  };

  // Handle specific field validation
  const handleFieldValidation = (field, value) => {
    let error = '';

    if (field === 'creditScore') {
      error = validateCreditScore(value);
    } else if (field === 'panNumber') {
      error = validatePAN(value);
    }

    setFieldErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return error === '';
  };

  const handleChange = (e) => {
    if (e.formData) {
      // Check if credit score changed
      if (formData.creditScore !== e.formData.creditScore) {
        handleFieldValidation('creditScore', e.formData.creditScore);
      }

      // Check if any guarantor's PAN changed
      if (e.formData.guarantors && e.formData.guarantors.length > 0) {
        e.formData.guarantors.forEach((guarantor, index) => {
          if (!formData.guarantors ||
            !formData.guarantors[index] ||
            formData.guarantors[index].panNumber !== guarantor.panNumber) {
            handleFieldValidation('panNumber', guarantor.panNumber);
          }
        });
      }

      onChange(e.formData);
    }
  };

  const handleSubmit = () => {
    let hasErrors = false;

    // Validate Credit Score
    const creditScoreError = validateCreditScore(formData.creditScore || '');
    if (creditScoreError) {
      setFieldErrors(prev => ({
        ...prev,
        creditScore: creditScoreError
      }));
      hasErrors = true;
    } else {
      setFieldErrors(prev => ({
        ...prev,
        creditScore: ''
      }));
    }

    // Validate PAN numbers for all guarantors if credit score is below 700
    if (formData.creditScore < 700 && formData.guarantors && formData.guarantors.length > 0) {
      let panError = '';
      for (let index = 0; index < formData.guarantors.length; index++) {
        const guarantor = formData.guarantors[index];
        const guarantorPanError = validatePAN(guarantor.panNumber || '');
        if (guarantorPanError) {
          panError = `Guarantor ${index + 1}: ${guarantorPanError}`;
          hasErrors = true;
          break;
        }
      }

      if (panError) {
        setFieldErrors(prev => ({
          ...prev,
          panNumber: panError
        }));
      } else {
        setFieldErrors(prev => ({
          ...prev,
          panNumber: ''
        }));
      }
    }

    if (!hasErrors) {
      onSubmit();
    }
  };

  // Get credit score status
  const getCreditScoreStatus = (score) => {
    if (!score) return { color: 'grey', text: 'Enter your credit score' };
    if (score >= 700) return { color: 'success', text: 'Good credit score' };
    if (score >= 600) return { color: 'warning', text: 'Fair credit score' };
    return { color: 'error', text: 'Poor credit score - At least 2 Guarantors required' };
  };

  const creditScoreStatus = getCreditScoreStatus(formData.creditScore);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        mb: 8,
        borderRadius: 2,
        backgroundColor: 'white',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      {/* Inject global styles */}
      <style>{globalStyles}</style>

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
          <AccountBalanceIcon
            color="primary"
            sx={{
              mr: 2,
              fontSize: 24,
            }}
          />
          <Typography variant="h6" component="h2" color="primary.main">
            Loan Details
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2, fontSize: '14px' }}>
          Please provide your credit score and loan requirements. Based on your credit score, you may need to provide additional documents or guarantors.
          <Typography component="span" color="primary.main" fontWeight="bold" sx={{ display: 'block', mt: 1 }}>
            Note: If credit score is below 700, you must provide at least 2 guarantors and upload bank statements.
          </Typography>
        </Typography>

        {/* Credit Score Status and Guarantor Requirement */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color={`${creditScoreStatus.color}.main`} gutterBottom>
            {creditScoreStatus.text}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(formData.creditScore - 300) / 6}
            color={creditScoreStatus.color}
            sx={{ height: 8, borderRadius: 4, mb: 2 }}
          />
          {formData.creditScore < 700 && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              Since your credit score is below 700, you need to provide at least 2 guarantors and upload bank statements to proceed with the loan application.
            </Alert>
          )}
        </Box>

        <Form
          schema={loanDetailsSchema}
          uiSchema={loanDetailsUiSchema}
          validator={validator}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          showErrorList={false}
          liveValidate={false}
          focusOnFirstError={true}
          className="loan-details-rjsf"
          templates={{ FieldTemplate: CustomFieldTemplate }}
          formContext={{
            isLoanForm: true,
            validateCreditScore,
            validatePAN,
            fieldErrors
          }}
          // Add styles to ensure all fields take full width
          style={{
            width: '100%',
          }}
        />
      </Paper>
    </Box>
  );
};

export default LoanDetailsForm;