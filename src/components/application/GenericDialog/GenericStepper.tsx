import React from 'react';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, Step, MobileStepper, Collapse, Chip, CircularProgress, useTheme, CardActions, Box } from '@material-ui/core';
import { useDialogState } from './useDialogState';
import merge from 'deepmerge';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';
import { isEnabled, useValues, isError, useStepFields } from './helpers';
import Fields from './Fields';
import OnActivate from './OnActivate';
import ErrorGate from './ErrorGate';
import RateNewAppHeader from '../../pages/RateNewApp/RateNewAppHeader';
import { publicUrl } from '../../../helpers';
import { useChangeRoute } from '../../layout/hooks';

const useStyles = makeStyles(({ spacing, palette, layout }: any) =>
  createStyles({
    dialog: {
      display: 'flex',
      flexDirection: 'column',
      outline: 'none',
      border: `5px solid ${palette.primary}`
    },
    capitalize: {
      textTransform: 'capitalize'
    },
    dialogActions: {
      margin: 0,
      padding: spacing(1),
      paddingTop: spacing(0.5),
      paddingBottom: spacing(0.5)
    },
    dialogTitle: {
      background: palette.primary.main,
      color: palette.common.white,
      maxHeight: 22
    },
    closeButton: {
      color: 'inherit'
    },
    deleteButton: {
      color: palette.common.white,
      background: palette.error.main,
      '&:hover': {
        background: palette.error.dark
      }
    },
    mobileStepper: {
      flexGrow: 1,
      background: 'white',
      width: 320
    },
    submitProgress: {
      color: palette.primary.light,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -(layout.progressSize / 2),
      marginLeft: -(layout.progressSize / 2)
    },
    stepSummary: {
      background: palette.background.default
    }
  })
);

export interface FieldProps {
  id: string | number;
  label: string;
  type: string;
  Field?: Element;
  getValue?: (f: FieldProps, values: any) => any;
}

export interface ComponentProps {
  id: string;
  title: string;
  initialValues?: object;
  cancelLabel: string;
  deleteLabel: string;
  submitLabel: string;
  SubmitIcon?: any;
  draggable: boolean;
  onSubmit: any;
  onDelete: any;
  validate: any;
  steps: any[];
  fullHeight: boolean;
  values: any;
  setValues: any;
  header?: boolean;
  onChange?: any;
  showActions?: boolean;
  FieldActions?: any;
  elevation?: any;
}

const GenericStepper = ({
  id,
  title: Title, // Title can be set via the state as well as the input props, state takes priority
  initialValues: InitialValues = {}, // If initial values are provided they are merged with the initial values from the state
  draggable = false,
  cancelLabel = 'Cancel',
  deleteLabel = 'Delete',
  submitLabel = 'Finish',
  SubmitIcon = CheckIcon,
  maxWidth = 'xs',
  steps = [] as any[],
  onSubmit,
  onDelete,
  onClose,
  validate,
  fullHeight = true,
  values: externalValues,
  setValues: externalSetValues,
  onChange,
  header = true,
  showActions = true,
  elevation = 3,
  FieldActions = undefined,
  disableInitialize = undefined,
  ...other
}: ComponentProps & any) => {
  const { layout } = useTheme();
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [state, setState] = useDialogState(id);
  const { type, open, submitting, loading, showErrors } = state;
  const setShowErrors = React.useCallback(show => setState(prev => ({ ...prev, showErrors: show })), [setState]);
  const title = state.title ? state.title : Title;
  const fields = useStepFields(steps);

  const { values, setValues, hasChanged, errors, mapField, initializeValues } = useValues({
    open,
    fields,
    InitialValues,
    state,
    setState,
    validate,
    externalValues,
    externalSetValues,
    onChange,
    disableInitialize
  });

  // Re-initialize values when necessary
  React.useEffect(() => {
    open && setActiveStep(0);
    open && setConfirmDelete(false);
  }, [open]);

  const handleReset = React.useCallback(() => {
    setActiveStep(0);
    setConfirmDelete(false);
    initializeValues();
  }, [setActiveStep, setConfirmDelete, initializeValues]);

  const classes = useStyles({});

  const activeSteps = steps.filter(s => isEnabled(typeof s.enabled === 'function' ? s.enabled(values) : s.enabled));
  const currentStep = (activeSteps && activeSteps[activeStep]) || {};
  const stepValidate = currentStep.validate;

  const activeErrorCount = currentStep.fields ? currentStep.fields.filter(f => isError(f, values, errors)).length : 0;

  const values_s = JSON.stringify(values);
  const handleSubmit = React.useCallback(() => {
    if (activeErrorCount > 0) {
      setShowErrors(true);
    } else {
      onSubmit && onSubmit(JSON.parse(values_s), handleReset, false);
    }
  }, [activeErrorCount, setShowErrors, onSubmit, values_s, handleReset]);

  const changeRoute = useChangeRoute();

  const onSaveSuccess = React.useCallback(() => {
    handleReset();
    changeRoute(publicUrl('/MyRatings'));
    alert('Draft saved!');
  }, [changeRoute, handleReset]);

  const handleSaveDraft = React.useCallback(() => {
    if (activeErrorCount > 0) {
      alert('Error saving, please fix errors and try again.');
      setShowErrors(true);
    } else {
      onSubmit && onSubmit(JSON.parse(values_s), onSaveSuccess, true);
    }
  }, [activeErrorCount, setShowErrors, onSubmit, values_s, onSaveSuccess]);

  const handleDelete = React.useCallback(() => {
    onDelete && onDelete(JSON.parse(values_s));
  }, [onDelete, values_s]);

  const handleConfirmDelete = React.useCallback(() => setConfirmDelete(prev => !prev), [setConfirmDelete]);

  const handleNext = React.useCallback(() => {
    if (activeErrorCount > 0) {
      setShowErrors(true);
    } else {
      const next = (newValues = undefined) => {
        newValues && setValues(prev => merge(prev, newValues));
        showErrors && setShowErrors(false);
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      };
      stepValidate ? stepValidate(JSON.parse(values_s), next) : next();
    }
  }, [setShowErrors, setValues, showErrors, stepValidate, setActiveStep, activeErrorCount, values_s]);

  const handleBack = React.useCallback(() => setActiveStep(prevActiveStep => prevActiveStep - 1), [setActiveStep]);

  const inProgress = loading || submitting;
  const disabled = inProgress || errors['loading'];

  return (
    <>
      <RateNewAppHeader onSave={handleSaveDraft} onReset={handleReset} />

      {title !== null && (
        <>
          {!confirmDelete && (
            <CardActions className={classes.stepSummary}>
              <Grid container style={{ paddingLeft: 12, paddingRight: 12 }} alignItems='center'>
                <Grid item zeroMinWidth xs>
                  <Typography noWrap color='textPrimary' variant='body1'>
                    {currentStep.label ? currentStep.label : currentStep.id}
                  </Typography>
                </Grid>
                {activeSteps.length > 1 && (
                  <Grid item>
                    <Chip color='primary' label={`${activeStep + 1} of ${activeSteps.length}`} />
                  </Grid>
                )}
              </Grid>
            </CardActions>
          )}
          <Divider />
        </>
      )}
      <Box mt={5} mb={5}>
        <ErrorGate error={errors['loading']}>
          {inProgress && <CircularProgress size={layout.progressSize} className={classes.submitProgress} />}
          <Collapse in={!confirmDelete}>
            {activeSteps.map(({ Template, fields = [], label, onActivate }, i) => {
              const FieldsComponent = Template ?? Fields;
              return (
                <Collapse key={i} in={activeStep === i}>
                  <Step key={label}>
                    <OnActivate key={label} index={i} activeIndex={activeStep} onActivate={onActivate} values={values} setValues={setValues}>
                      <Grid container alignItems='center' spacing={1}>
                        <FieldsComponent fields={fields} mapField={mapField} values={values} state={state} setState={setState} setValues={setValues} />
                        {FieldActions ? (
                          <Grid item xs={12}>
                            <FieldActions handleNext={handleNext} handleBack={handleBack} handleSubmit={handleSubmit} activeStep={activeStep} />
                          </Grid>
                        ) : (
                          <></>
                        )}
                      </Grid>
                    </OnActivate>
                  </Step>
                </Collapse>
              );
            })}
          </Collapse>
          {confirmDelete && (
            <Grid container spacing={2} justify='center' alignItems='center'>
              <Grid item>
                <Button onClick={handleConfirmDelete} color='secondary'>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={handleDelete} className={classes.deleteButton}>
                  <DeleteIcon style={{ marginRight: 4 }} />
                  Confirm {deleteLabel}
                </Button>
              </Grid>
            </Grid>
          )}
        </ErrorGate>
      </Box>
      <Grid container justify='center'>
        <Grid item>
          <MobileStepper
            variant='dots'
            steps={activeSteps.length}
            position='static'
            activeStep={activeStep}
            className={classes.mobileStepper}
            nextButton={
              activeStep === activeSteps.length - 1 ? (
                <Button color='primary' size='small' variant='contained' disabled={!hasChanged || disabled} onClick={handleSubmit}>
                  {submitLabel}
                  <SubmitIcon style={{ marginLeft: 4 }} />
                </Button>
              ) : (
                <>
                  <Button color='primary' size='small' variant='contained' onClick={handleNext} disabled={disabled}>
                    Next
                    <KeyboardArrowRight />
                  </Button>
                </>
              )
            }
            backButton={
              activeStep === 0 && type === 'Edit' && onDelete !== undefined ? (
                <Button className={classes.deleteButton} size='small' variant='contained' onClick={handleConfirmDelete} disabled={disabled}>
                  <DeleteIcon style={{ marginRight: 4 }} />
                  {deleteLabel}
                </Button>
              ) : (
                <Button size='small' onClick={handleBack} disabled={activeStep === 0 || disabled}>
                  <KeyboardArrowLeft />
                  Back
                </Button>
              )
            }
          />
        </Grid>
      </Grid>
    </>
  );
};

export default GenericStepper;
