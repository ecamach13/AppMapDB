import * as React from 'react';
import { makeStyles, Grid, IconButton, Menu, MenuItem, Divider } from '@material-ui/core';
import { createStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import logo from '../../images/logo.png';
import { useAppBarHeightRef, useHandleChangeRoute, useChangeRoute } from './hooks';
import { publicUrl, useHandleToggleLayout } from '../../helpers';
import * as LoginDialog from '../application/GenericDialog/Login';
import * as RegisterDialog from '../application/GenericDialog/Register';
import DialogButton from '../application/GenericDialog/DialogButton';
import { useSelector } from 'react-redux';
import { useDialogState } from '../application/GenericDialog/useDialogState';
import { useSignedIn, useFullScreen, useIsAdmin } from '../../hooks';
import { beta } from '../../constants';
import TabSelectorToolBar from '../general/TabSelector/TabSelectorToolBar';
import * as Icons from '@material-ui/icons';
import { useSetUser } from './store';

const useStyles = makeStyles(({ breakpoints, palette, layout }: any) =>
  createStyles({
    appBar: {
      paddingTop: beta ? layout.footerheight : 0,
      background: palette.primary.main,
      color: palette.common.white,
      paddingLeft: layout.contentpadding,
      paddingRight: layout.contentpadding
    },
    appBarFullScreen: {
      paddingTop: beta ? layout.footerheight : 0,
      background: palette.primary.main,
      color: palette.common.white
    },
    logo: {
      paddingLeft: 8,
      paddingRight: 16,
      height: layout.toolbarheight - 16,
      [breakpoints.down('xs')]: {
        display: 'none'
      },
      cursor: 'pointer'
    },
    active: {
      backgroundColor: palette.primary.dark
    },
    toolbar: {
      background: palette.white
    },
    accountMenuItem: {
      pointerEvents: 'none',
      background: palette.primary.light,
      color: palette.common.white
    }
  })
);

const tabs = [
  { id: 'Find an App', icon: Icons.Search, onClick: () => alert('click'), route: '/' },
  { id: 'Apps', icon: Icons.Apps, route: '/Apps' },
  { id: 'Rate an App', icon: Icons.PostAdd, route: '/RateNewAppIntro' },
  { id: 'Framework & Questions', icon: Icons.Help, route: '/FrameworkQuestions' },
  { id: 'News', icon: Icons.Announcement, route: '/News' }
];

const AppBarTabSelector = props => <TabSelectorToolBar id='AppBar' tabs={tabs} {...props} />;

export default function ApplicationBar() {
  const classes = useStyles();
  const handleChangeRoute = useHandleChangeRoute();
  const [{ open: registerOpen }, setRegisterState] = useDialogState(RegisterDialog.title);
  const [{ open: loginOpen }, setLoginState] = useDialogState(LoginDialog.title);
  const signedIn = useSignedIn();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const setUser = useSetUser();

  const handleLogout = React.useCallback(() => {
    registerOpen && setRegisterState(prev => ({ ...prev, open: false, loading: false })); // Close the register dialog if it happens to be open (since the button is automatically unmounted when logging in the state is controlled here)
    loginOpen && setLoginState(prev => ({ ...prev, open: false, loading: false })); // Ensure login dialog is closed
    setUser(undefined); // Reset user information
    setAnchorEl(null);
  }, [setUser, registerOpen, loginOpen, setRegisterState, setLoginState, setAnchorEl]);

  const email = useSelector((s: any) => s.layout.user?.signInUserSession?.idToken?.payload?.email);

  const changeRoute = useChangeRoute();

  const handleTabChange = React.useCallback(
    value => {
      const { route } = tabs.find(t => t.id === value);
      changeRoute(publicUrl(route));
    },
    [changeRoute]
  );

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fullScreen = useFullScreen('xs');

  const handleToggleLayout = useHandleToggleLayout();
  const isAdmin = useIsAdmin();

  return (
    <AppBar ref={useAppBarHeightRef()} position='fixed' color='inherit' elevation={0} className={fullScreen ? classes.appBarFullScreen : classes.appBar}>
      <Toolbar className={classes.toolbar} disableGutters={true}>
        <Grid container alignItems='center' spacing={0}>
          <Grid item>
            <img className={classes.logo} src={logo} alt='logo' onClick={handleChangeRoute(publicUrl('/'))} />
          </Grid>
          <Grid item xs style={{ minWidth: 0 }}>
            <AppBarTabSelector onChange={handleTabChange} />
          </Grid>
          <Grid item>
            <Grid container justify='flex-end' alignItems='center'>
              <Grid item>
                <IconButton color='inherit' aria-label='account of current user' aria-haspopup='true' onClick={handleMenu}>
                  {signedIn ? <Icons.AccountCircleTwoTone /> : <Icons.AccountCircle />}
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{ style: { paddingTop: signedIn ? 0 : undefined } }}
                >
                  {signedIn
                    ? [
                        <MenuItem key='email' className={classes.accountMenuItem}>
                          {email}
                        </MenuItem>,
                        <Divider key='divider' />,
                        <MenuItem key='logout' onClick={handleLogout}>
                          Logout
                        </MenuItem>,
                        isAdmin ? (
                          <DialogButton key='Toggle Layout' onClick={handleToggleLayout} variant='menuitem' tooltip=''>
                            Toggle Layout
                          </DialogButton>
                        ) : (
                          <></>
                        )
                      ]
                    : [
                        { label: 'Login', Module: LoginDialog, onClick: handleClose },
                        { label: 'Signup', Module: RegisterDialog, onClick: handleClose }
                      ].map(({ label, Module, onClick }) => (
                        <DialogButton key={label} Module={Module} onClick={onClick} variant='menuitem' tooltip=''>
                          {label}
                        </DialogButton>
                      ))}
                </Menu>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
