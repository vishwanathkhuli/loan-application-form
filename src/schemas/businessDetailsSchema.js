const commonErrorStyle = {
  marginTop: '4px',
  fontWeight: 500,
  fontSize: '12px',
  color: '#d32f2f'
};

const commonFieldOptions = {
  className: 'full-width-field'
};

const businessDetailsSchema = {
  type: 'object',
  required: ['businessName', 'gstin', 'directors'],
  properties: {
    businessName: {
      type: 'string',
      title: 'Business Name',
      minLength: 3,
      errorMessage: {
        required: 'Please enter your business name',
        minLength: 'Business name must be at least 3 characters long'
      }
    },
    gstin: {
      type: 'string',
      title: 'GSTIN',
      pattern: '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$',
      description: 'Enter a valid 15-character GSTIN',
      errorMessage: {
        required: 'Please enter your GSTIN',
        pattern: 'Please enter a valid 15-character GSTIN (e.g., 22AAAAA0000A1Z5)'
      }
    },
    directors: {
      type: 'array',
      title: 'Directors',
      minItems: 1,
      errorMessage: {
        required: 'Please add at least one director',
        minItems: 'Please add at least one director'
      },
      items: {
        type: 'object',
        required: ['name', 'panNumber', 'tags'],
        properties: {
          name: {
            type: 'string',
            title: 'Name',
            minLength: 2,
            errorMessage: {
              required: 'Please enter director\'s name',
              minLength: 'Director name must be at least 2 characters long'
            }
          },
          panNumber: {
            type: 'string',
            title: 'PAN Number',
            pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
            description: 'Enter a valid 10-character PAN',
            errorMessage: {
              required: 'Please enter director\'s PAN number',
              pattern: 'Please enter a valid 10-character PAN (e.g., ABCDE1234F)'
            }
          },
          tags: {
            type: 'array',
            title: 'Tags',
            minItems: 1,
            items: {
              type: 'string',
              title: 'Tag',
              enum: ['Director', 'Authorized Signatory'],
              errorMessage: {
                enum: 'Please select a valid role from the list'
              }
            },
            description: 'Select relevant roles and positions for the person',
            errorMessage: {
              required: 'Please select at least one role for the director',
              minItems: 'Please select at least one role for the director'
            }
          }
        }
      }
    }
  }
};

export const businessDetailsUiSchema = {
  'ui:title': 'Business Details',
  'ui:showErrorList': false,
  'ui:classNames': 'business-details-form',
  'ui:options': {
    requiredLabel: true,
  },
  businessName: {
    'ui:autofocus': true,
    'ui:placeholder': 'Enter your business name',
    'ui:options': commonFieldOptions
  },
  gstin: {
    'ui:placeholder': 'e.g. 22AAAAA0000A1Z5',
    'ui:description': 'Your 15-digit Goods and Services Tax Identification Number',
    'ui:options': commonFieldOptions,
    'ui:help': 'Format: 22AAAAA0000A1Z5',
    'ui:widget': 'text',
    'ui:error': {
      'ui:widget': 'errors',
      'ui:options': {
        className: 'validation-error',
        style: commonErrorStyle
      }
    }
  },
  directors: {
    'ui:title': 'Directors',
    'ui:description': 'Add details of all company directors',
    'ui:options': {
      orderable: false,
      removable: true,
      addButtonText: 'Add Another Director',
      className: 'full-width-field'
    },
    items: {
      'ui:title': 'Director',
      'ui:options': {
        removable: true,
        removeButtonText: 'Remove Director',
        className: 'director-item'
      },
      name: {
        'ui:placeholder': 'Director\'s full name',
        'ui:options': commonFieldOptions
      },
      panNumber: {
        'ui:placeholder': 'e.g. ABCDE1234F',
        'ui:description': 'Permanent Account Number issued by Income Tax Department',
        'ui:options': commonFieldOptions,
        'ui:help': 'Format: ABCDE1234F',
        'ui:widget': 'text',
        'ui:error': {
          'ui:widget': 'errors',
          'ui:options': {
            className: 'validation-error',
            style: commonErrorStyle
          }
        }
      },
      tags: {
        'ui:title': 'Tags',
        'ui:description': 'Select relevant roles and positions for the person',
        'ui:options': {
          addButtonText: 'Add Tag',
          className: 'full-width-field'
        }
      }
    }
  }
};

export default businessDetailsSchema; 