import * as React from 'react';
import { Grid, Typography, createStyles, makeStyles, Button } from '@material-ui/core';
import * as Icons from '@material-ui/icons';

const useStyles = makeStyles(({ palette }: any) =>
  createStyles({
    arrowRight: ({ fontSize, marginTop }: any) => ({
      color: palette.primary.light,
      fontSize,
      marginTop
    }),
    primaryTextSmall: {
      fontWeight: 900,
      color: palette.primary.dark
    }
  })
);

export default function ArrowButton({ size = 'normal' as any, variant = 'body1' as any, label, onClick = undefined }) {
  const classes = useStyles({ fontSize: size === 'small' ? 19 : undefined, marginTop: size === 'small' ? 1 : undefined });
  return (
    <Button size={size} onClick={onClick}>
      <Grid container spacing={1}>
        <Grid item>
          <Typography variant={variant} className={classes.primaryTextSmall}>
            {label}
          </Typography>
        </Grid>
        <Grid item>
          <Icons.ArrowRightAlt className={classes.arrowRight} />
        </Grid>
      </Grid>
    </Button>
  );
}
