import React from 'react';
import GenericDialog from '../GenericDialog';
import { copyToLower, isEmpty as isValEmpty } from '../../../../helpers';
import { useDialogState } from '../useDialogState';
import DialogButton from '../DialogButton';
import Label from '../../DialogField/Label';
import { Auth } from 'aws-amplify';
import { useSetUser } from '../../../layout/store';
import { Button, createStyles, DialogContent, Grid, makeStyles, Typography } from '@material-ui/core';
import { useFullScreen } from '../../../../hooks';
import { InjectField } from '../Fields';
import TextLabel from '../../DialogField/TextLabel';
import RateAnApp from '../RegisterV2/RateAnApp';

export const title = 'Login';
const maxWidth = 'md';

const handleValidation = ({ message }, dialogState) => {
  var errors = copyToLower(dialogState.errors); // start with server generated errors, ensure all keys start with lowercase letter

  if (!isValEmpty(message)) {
    if (message.includes('password') || message.includes('Password')) {
      errors['password'] = message;
    } else {
      errors['email'] = message;
    }
  }

  return errors;
};

const ForgotPassword = ({ value = false, onChange }) => {
  const handleClick = () => onChange({ target: { value: !value } });
  return (
    <DialogButton color='white' variant='link' tooltip='' onClick={handleClick}>
      {value ? 'Back' : 'Forgot Password'}
    </DialogButton>
  );
};

const borderRadius = 25;

const useStyles = makeStyles(({ palette }) =>
  createStyles({
    primaryButton: {
      borderRadius: 7,
      color: palette.common.white,
      background: palette.primary.dark,
      minWidth: 160,
      height: 40,
      '&:hover': {
        background: palette.primary.main
      }
    },
    rateAnApp: {
      background: palette.secondary.light,
      color: palette.text.primary,
      padding: 24,
      borderRadius
    },
    arrowRight: {
      color: palette.primary.light
    },
    infoContainer: {
      background: palette.primary.light,
      color: palette.common.white,
      borderRadius
    },
    content: {
      paddingLeft: 48,
      paddingRight: 48,
      paddingTop: 16,
      paddingBottom: 16,
      background: palette.primary.light,
      color: palette.common.white
    }
  })
);

function Content({ fields, values, mapField, fullWidth, setValues, ...props }) {
  const injectField = id => <InjectField id={id} fields={fields} values={values} setValues={setValues} mapField={mapField} fullWidth={fullWidth} {...props} />;

  const classes = useStyles();
  const fs = useFullScreen('sm');

  const [state, setState] = useDialogState(title);

  const { enterNewPassword, errors } = state;
  const dialogStateStr = JSON.stringify(state);
  const setUser = useSetUser();

  const handleLogin = React.useCallback(
    ({ forgotPassword, confirmationCode, newPassword, email, password } = {}) => () => {
      if (forgotPassword) {
        if (enterNewPassword) {
          Auth.forgotPasswordSubmit(email, confirmationCode, newPassword)
            .then(data => {
              alert('Successfully updated password.');
              Auth.signIn(email, newPassword)
                .then(user => {
                  console.log('Login success!');
                  setUser(user);
                  setState(prev => ({ ...prev, open: false, loading: false, errors: {} }));
                })
                .catch(err => {
                  console.error('Error with Login');
                  console.error(err);
                  const newErrors = handleValidation({ ...errors, message: err.message }, JSON.parse(dialogStateStr));
                  setState(prev => ({ ...prev, loading: false, showErrors: true, errors: newErrors }));
                });
            })
            .catch(err => {
              console.error('Error resetting password');
              console.error(err);
              const newErrors = handleValidation({ ...errors, message: err.message }, JSON.parse(dialogStateStr));
              setState(prev => ({ ...prev, loading: false, showErrors: true, errors: newErrors }));
            });
        } else {
          Auth.forgotPassword(email)
            .then(data => {
              alert('An email has been sent with instructions for resetting your password.');
              setState(prev => ({ ...prev, loading: false, enterNewPassword: true }));
            })
            .catch(err => {
              console.error('Error requesting reset');
              const newErrors = handleValidation({ ...errors, message: err.message }, JSON.parse(dialogStateStr));
              setState(prev => ({ ...prev, loading: false, showErrors: true, errors: newErrors }));
            });
        }
      } else {
        Auth.signIn(email, password)
          .then(user => {
            console.log('Login success!');
            setUser(user);
            setState(prev => ({ ...prev, open: false, loading: false, errors: {} }));
          })
          .catch(err => {
            console.error('Error with Login');
            console.error(err);
            const newErrors = handleValidation({ ...errors, message: err.message }, JSON.parse(dialogStateStr));
            setState(prev => ({ ...prev, loading: false, showErrors: true, errors: newErrors }));
          });
      }
    },
    [enterNewPassword, setUser, dialogStateStr, setState, errors]
  );

  var submitLabel = values.forgotPassword ? (enterNewPassword ? 'Change Password' : 'Request Reset') : 'Login';

  return (
    <DialogContent className={classes.content}>
      <Grid container style={{ paddingBottom: 32 }} spacing={4}>
        <Grid item xs={fs ? 12 : 6}>
          <Grid container alignItems='center' spacing={0} className={classes.infoContainer}>
            <Grid item xs={12}>
              <Typography variant='h5'>Log in to our internal platform:</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container style={{ marginTop: 8, marginBottom: 8 }} alignItems='center' spacing={1}>
                <Grid item xs={12}>
                  {injectField('email')}
                </Grid>
                <Grid item xs={12}>
                  {injectField('password')}
                </Grid>

                <Grid item xs={12}>
                  {injectField('forgotPasswordLabel')}
                </Grid>

                <Grid item xs={12}>
                  {injectField('forgotPassword')}
                </Grid>

                <Grid item xs={12}>
                  {injectField('confirmationCode')}
                </Grid>

                <Grid item xs={12}>
                  {injectField('newPassword')}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'center' }}>
              <Button onClick={handleLogin(values)} className={classes.primaryButton}>
                {submitLabel}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={fs ? 12 : 6}>
          <RateAnApp onClick={() => setState(prev => ({ ...prev, open: false }))} />
        </Grid>
      </Grid>
    </DialogContent>
  );
}

export default function LoginDialog({ id = title }) {
  const [dialogState] = useDialogState(id);
  const { enterNewPassword } = dialogState;

  const fs = useFullScreen('sm');

  return (
    <GenericDialog
      id={id}
      PaperProps={{
        style: {
          borderRadius: fs ? 0 : 25
        }
      }}
      title=''
      divider={false}
      dialogActions={false}
      maxWidth={maxWidth}
      validate={handleValidation}
      Content={Content}
      fields={[
        {
          id: 'email',
          placeholder: 'Email Address',
          label: 'Email address',
          Field: TextLabel,
          required: true,
          email: true,
          hidden: enterNewPassword,
          InputProps: {
            style: { background: 'white' }
          }
        },
        {
          id: 'password',
          label: 'Password',
          required: true,
          Field: TextLabel,
          inputProps: {
            type: 'password'
          },
          hidden: values => values.forgotPassword || enterNewPassword,
          InputProps: {
            style: { background: 'white' }
          }
        },
        {
          id: 'forgotPasswordLabel',
          label: 'Enter your email address and press request reset. We will send you an email with a code to reset your password.',
          Field: Label,
          initialValue: false,
          hidden: values => !values.forgotPassword || enterNewPassword
        },
        {
          id: 'forgotPassword',
          label: 'Forgot Password',
          Field: ForgotPassword,
          initialValue: false,
          hidden: enterNewPassword
        },
        {
          id: 'confirmationCode',
          label: 'Enter Verification Code Sent to Email Address',
          Field: TextLabel,
          required: true,
          hidden: !enterNewPassword,
          initialValue: '',
          InputProps: {
            style: { background: 'white' }
          }
        },
        {
          id: 'newPassword',
          label: 'New Password',
          Field: TextLabel,
          required: true,
          inputProps: {
            type: 'password'
          },
          hidden: !enterNewPassword,
          InputProps: {
            style: { background: 'white' }
          }
        }
      ]}
    />
  );
}
