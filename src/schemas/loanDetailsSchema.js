const commonErrorStyle = {
  marginTop: '4px',
  fontWeight: 500,
  fontSize: '12px',
  color: '#d32f2f'
};

const loanDetailsSchema = {
  type: 'object',
  required: ['creditScore', 'requiredLoanAmount'],
  properties: {
    creditScore: {
      type: 'number',
      title: 'Credit Score',
      minimum: 300,
      maximum: 900,
      description: 'Your credit score from credit bureau',
      errorMessage: {
        required: 'Please select your credit score',
        minimum: 'Credit score must be at least 300',
        maximum: 'Credit score cannot exceed 900'
      }
    },
    requiredLoanAmount: {
      type: 'number',
      title: 'Required Loan Amount',
      minimum: 50000,
      maximum: 500000,
      description: 'Amount you wish to borrow (₹50,000 - ₹5,00,000)',
      errorMessage: {
        required: 'Please select your required loan amount',
        minimum: 'Loan amount must be at least ₹50,000',
        maximum: 'Loan amount cannot exceed ₹5,00,000'
      }
    },
    guarantors: {
      type: 'array',
      title: 'Guarantors',
      description: 'Since your credit score is below 700, you need to provide at least 2 guarantors.',
      minItems: 2,
      items: {
        type: 'object',
        required: ['name', 'panNumber', 'relationship'],
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            minLength: 2,
            errorMessage: {
              required: 'Please enter guarantor\'s name',
              minLength: 'Name must be at least 2 characters long'
            }
          },
          panNumber: {
            type: 'string',
            title: 'PAN Number',
            pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
            description: 'Enter a valid 10-character PAN',
            errorMessage: {
              required: 'Please enter guarantor\'s PAN number',
              pattern: 'Please enter a valid 10-character PAN (e.g., ABCDE1234F)'
            }
          },
          relationship: {
            type: 'string',
            title: 'Relationship with Applicant',
            enum: ['Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Other'],
            enumNames: ['Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Other'],
            errorMessage: {
              required: 'Please select relationship with applicant'
            }
          },
          relation: {
            type: 'string',
            title: 'Specify Relation',
            description: 'Please specify your relationship'
          }
        },
        dependencies: {
          relationship: {
            oneOf: [
              {
                properties: {
                  relationship: {
                    enum: ['Other']
                  },
                  relation: {
                    type: 'string',
                    minLength: 2,
                    title: 'Specify Relation',
                    description: 'Please specify your relationship',
                    errorMessage: {
                      required: 'Please specify your relationship',
                      minLength: 'Relationship must be at least 2 characters long'
                    }
                  }
                },
                required: ['relation']
              },
              {
                properties: {
                  relationship: {
                    enum: ['Father', 'Mother', 'Brother', 'Sister', 'Spouse']
                  }
                }
              }
            ]
          }
        }
      }
    },
    bankStatements: {
      type: 'array',
      title: 'Bank Statements',
      description: 'Since your credit score is below 700, please upload your bank statements for the last 6 months.',
      items: {
        type: 'string',
        format: 'data-url'
      }
    }
  },
  dependencies: {
    creditScore: {
      oneOf: [
        {
          properties: {
            creditScore: {
              enum: Array.from({ length: 400 }, (_, i) => i + 300).filter(score => score < 700)
            }
          },
          required: ['guarantors', 'bankStatements']
        },
        {
          properties: {
            creditScore: {
              enum: Array.from({ length: 201 }, (_, i) => i + 700)
            }
          }
        }
      ]
    }
  }
};

const loanDetailsUiSchema = {
  "ui:title": "Loan Details",
  "ui:order": ["creditScore", "requiredLoanAmount", "guarantors", "bankStatements"],
  creditScore: {
    'ui:widget': 'range',
    'ui:options': {
      min: 300,
      max: 900,
      step: 1,
      className: 'full-width-field'
    },
    'ui:error': {
      'ui:widget': 'errors',
      'ui:options': {
        className: 'validation-error',
        style: commonErrorStyle
      }
    }
  },
  requiredLoanAmount: {
    'ui:widget': 'range',
    'ui:options': {
      min: 50000,
      max: 500000,
      step: 10000,
      className: 'full-width-field'
    },
    'ui:error': {
      'ui:widget': 'errors',
      'ui:options': {
        className: 'validation-error',
        style: commonErrorStyle
      }
    }
  },
  guarantors: {
    'ui:options': {
      orderable: false,
      addButtonText: 'Add Guarantor',
      className: 'full-width-field'
    },
    items: {
      'ui:title': 'Guarantor Details',
      name: {
        'ui:placeholder': 'Guarantor\'s full name',
        'ui:options': {
          className: 'full-width-field'
        }
      },
      panNumber: {
        'ui:placeholder': 'e.g. ABCDE1234F',
        'ui:description': 'Permanent Account Number issued by Income Tax Department',
        'ui:options': {
          className: 'full-width-field'
        }
      },
      relationship: {
        'ui:widget': 'select',
        'ui:placeholder': 'Select relationship',
        'ui:options': {
          className: 'guarantor-relationship-field full-width-field'
        }
      },
      relation: {
        'ui:widget': 'text',
        'ui:placeholder': 'Enter relationship',
        'ui:options': {
          className: 'full-width-field'
        },
        'ui:hidden': (formData) => formData.relationship !== 'Other'
      }
    }
  },
  bankStatements: {
    'ui:widget': 'files',
    'ui:options': {
      accept: '.pdf,.jpg,.jpeg,.png',
      multiple: true,
      className: 'full-width-field'
    }
  }
};

export { loanDetailsSchema, loanDetailsUiSchema };