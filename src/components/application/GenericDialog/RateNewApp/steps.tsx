import MultiSelectCheck from '../../DialogField/MultiSelectCheck';
import {
  Platforms,
  DeveloperTypeQuestions,
  CostQuestions,
  PrivacyQuestions,
  FunctionalityQuestions,
  ClinicalFoundationQuestions,
  FeatureQuestions,
  EngagementQuestions,
  UseQuestions,
  OutputQuestions,
  InputQuestions,
  Conditions
} from '../../../../database/models/Application';
import { tables } from '../../../../database/dbConfig';
import { isEmpty, getAndroidIdFromUrl, getAppleIdFromUrl } from '../../../../helpers';
import SupportedPlatforms from './templates/SupportedPlatforms';
import ApplicationInfo from './templates/ApplicationInfo';
import AndroidStore from '../../DialogField/AndroidStore';
import AppleStore from '../../DialogField/AppleStore';
import WholeNumberUpDown from '../../DialogField/WholeNumberUpDown';
import TextLink from '../../DialogField/TextLink';
import YesNoGroup from '../../DialogField/YesNoGroup';
import PrivacyInfo from './templates/PrivacyInfo';
import ClinicalFoundationInfo from './templates/ClinicalFoundationInfo';
import Review from './templates/Review';

const steps = (type = undefined) => [
  {
    label: 'For each platform, enter associated link or remove if unsupported. Click next to continue.',
    Template: SupportedPlatforms,
    fields: [
      {
        id: 'platforms',
        label: 'Platforms',
        Field: MultiSelectCheck,
        items: Platforms.map(label => ({ value: label, label })),
        required: true,
        initialValue: type === 'Add' ? Platforms : undefined
      },
      {
        id: 'androidLink',
        label: 'Enter link to app on Google Play store',
        required: true,
        http: true,
        validate: values => isEmpty(getAndroidIdFromUrl(values.applications['androidLink'])) && 'Invalid Url format.  Must contain the application id.',
        hidden: values => !(Array.isArray(values[tables.applications]?.platforms) && values[tables.applications]?.platforms.includes('Android'))
      },
      {
        id: 'iosLink',
        label: 'Enter link to app on the Apple App store',
        required: true,
        http: true,
        validate: values => isEmpty(getAppleIdFromUrl(values.applications['iosLink'])) && 'Invalid Url format.  Must contain the application id.',
        hidden: values => !(Array.isArray(values[tables.applications]?.platforms) && values[tables.applications]?.platforms.includes('iOS'))
      },
      {
        id: 'webLink',
        label: 'Enter web link to app',
        required: true,
        http: true,
        hidden: values => !(Array.isArray(values[tables.applications]?.platforms) && values[tables.applications]?.platforms.includes('Web'))
      }
    ].map(f => ({ ...f, container: tables.applications }))
  },
  {
    label: 'Enter application information. Click next to continue.',
    Template: ApplicationInfo,
    fields: [
      {
        id: 'androidStore',
        Field: AndroidStore,
        load: true
      },
      {
        id: 'appleStore',
        Field: AppleStore,
        load: true
      },
      {
        id: 'name',
        label: 'Name'
      },
      {
        id: 'company',
        label: 'Company'
      },
      {
        id: 'costs',
        label: 'Cost',
        Field: YesNoGroup,
        items: CostQuestions
      },
      {
        id: 'developerTypes',
        label: 'Application Origin',
        description:
          'Every app will be in at least one of these categories but can be in more than one of them (a university-affiliated hospital, for example, could be both academic, healthcare, and non-profit). When in doubt, put for profit. Refer to app store description and app itself (i.e. is there a logo on the interface) and developer website.',
        Field: YesNoGroup,
        items: DeveloperTypeQuestions
      },
      {
        id: 'conditions',
        label: 'Supported Conditions',
        Field: MultiSelectCheck,
        items: Conditions.map(value => ({ value, label: value }))
      }
    ].map(f => ({ ...f, container: tables.applications }))
  },
  {
    label: 'Enter privacy/security information. Click next to continue.',
    Template: PrivacyInfo,
    fields: [
      {
        id: 'androidStore',
        Field: AndroidStore
      },
      {
        id: 'appleStore',
        Field: AppleStore
      },
      {
        id: 'privacies',
        label: 'Privacy & Security',
        Field: YesNoGroup,
        items: PrivacyQuestions
      },
      {
        id: 'readingLevel',
        label: null,
        Field: WholeNumberUpDown,
        min: 0,
        max: 20,
        initialValue: 0
      }
    ].map(f => ({ ...f, container: tables.applications }))
  },
  {
    label: 'Enter functionality and data sharing information. Click next to continue.',
    Template: ApplicationInfo,
    fields: [
      {
        id: 'androidStore',
        Field: AndroidStore
      },
      {
        id: 'appleStore',
        Field: AppleStore
      },
      {
        id: 'functionalities',
        label: 'Functionality & Data Sharing',
        Field: YesNoGroup,
        items: FunctionalityQuestions
      }
    ].map(f => ({ ...f, container: tables.applications }))
  },
  {
    label: 'Enter evidence and clinical foundation information. Click next to continue.',
    Template: ClinicalFoundationInfo,
    fields: [
      {
        id: 'androidStore',
        Field: AndroidStore
      },
      {
        id: 'appleStore',
        Field: AppleStore
      },
      {
        id: 'clinicalFoundations',
        label: 'Evidence & Clinical Foundations',
        Field: YesNoGroup,
        items: ClinicalFoundationQuestions
      },
      {
        id: 'feasibilityStudies',
        label: null,
        Field: WholeNumberUpDown,
        min: 0,
        max: 999,
        required: true,
        initialValue: 0
      },
      {
        id: 'feasibilityStudiesLink',
        label: 'Please enter the link of the supporting study',
        Field: TextLink,
        fullWidth: true,
        hidden: values => (values?.applications?.feasibilityStudies !== undefined && parseInt(values?.applications?.feasibilityStudies) > 0 ? false : true)
      },
      {
        id: 'feasibilityImpact',
        label: null,
        Field: WholeNumberUpDown,
        min: 0,
        max: 99.9,
        step: 0.1,
        inputProps: {
          decimalScale: 1
        },
        required: true,
        initialValue: 0
      },
      {
        id: 'efficacyStudies',
        label: null,
        Field: WholeNumberUpDown,
        min: 0,
        max: 999,
        required: true,
        initialValue: 0
      },
      {
        id: 'efficacyStudiesLink',
        label: 'Please enter the link of the supporting study',
        Field: TextLink,
        fullWidth: true,
        hidden: values => (values?.applications?.efficacyStudies !== undefined && parseInt(values?.applications?.efficacyStudies) > 0 ? false : true)
      },
      {
        id: 'efficacyImpact',
        label: null,
        Field: WholeNumberUpDown,
        min: 0,
        max: 99.9,
        step: 0.1,
        inputProps: {
          decimalScale: 1
        },
        required: true,
        initialValue: 0
      }
    ].map(f => ({ ...f, container: tables.applications }))
  },
  {
    label: 'Enter feature information. Click next to continue.',
    Template: ApplicationInfo,
    fields: [
      {
        id: 'androidStore',
        Field: AndroidStore
      },
      {
        id: 'appleStore',
        Field: AppleStore
      },
      {
        id: 'features',
        label: 'Application Features',
        Field: YesNoGroup,
        items: FeatureQuestions
      }
    ].map(f => ({ ...f, container: tables.applications }))
  },
  {
    label: 'Enter engagement information. Click next to continue.',
    Template: ApplicationInfo,
    fields: [
      {
        id: 'androidStore',
        Field: AndroidStore
      },
      {
        id: 'appleStore',
        Field: AppleStore
      },
      {
        id: 'engagements',
        label: 'Application Engagements',
        Field: YesNoGroup,
        items: EngagementQuestions
      }
    ].map(f => ({ ...f, container: tables.applications }))
  },
  {
    label: 'Enter input information. Click next to continue.',
    Template: ApplicationInfo,
    fields: [
      {
        id: 'androidStore',
        Field: AndroidStore
      },
      {
        id: 'appleStore',
        Field: AppleStore
      },
      {
        id: 'inputs',
        label: 'Application Inputs',
        Field: YesNoGroup,
        items: InputQuestions
      }
    ].map(f => ({ ...f, container: tables.applications }))
  },
  {
    label: 'Enter output information. Click next to continue.',
    Template: ApplicationInfo,
    fields: [
      {
        id: 'androidStore',
        Field: AndroidStore
      },
      {
        id: 'appleStore',
        Field: AppleStore
      },
      {
        id: 'outputs',
        label: 'Application Outputs',
        Field: YesNoGroup,
        items: OutputQuestions
      }
    ].map(f => ({ ...f, container: tables.applications }))
  },
  {
    label: 'Enter application usage information. Click next to continue.',
    Template: ApplicationInfo,
    fields: [
      {
        id: 'androidStore',
        Field: AndroidStore
      },
      {
        id: 'appleStore',
        Field: AppleStore
      },
      {
        id: 'uses',
        label: 'Application Uses',
        Field: YesNoGroup,
        items: UseQuestions
      }
    ].map(f => ({ ...f, container: tables.applications }))
  },
  {
    label: 'Enter qualitative review.',
    Template: Review,
    fields: [
      {
        id: 'androidStore',
        Field: AndroidStore
      },
      {
        id: 'appleStore',
        Field: AppleStore
      },
      {
        id: 'review',
        label: 'Review',
        multiline: true,
        rows: 12,
        placeholder: 'Please enter a qualitative review.',
        hidden: false
      }
    ].map(f => ({ ...f, container: tables.applications }))
  }
];

export default steps;
