import * as React from 'react';
import { Grid, Typography, createStyles, makeStyles } from '@material-ui/core';
import { useFullScreen } from '../../hooks';
import useFilterList from '../../database/useFilterList';
import TableSearchV2 from '../application/GenericTable/TableSearchV2';
import MultiSelectCheck from '../application/DialogField/MultiSelectCheck';
import { Platforms } from '../../database/models/Application';
import { useTableValues } from '../application/GenericTable/store';
import { useHeaderHeightRef } from '../layout/hooks';

const padding = 32;
const spacing = 1;

const getMobilePadding = breakpoints => ({
  padding,
  fontWeight: 900,
  [breakpoints.down('sm')]: {
    padding: getPadding('sm')
  },
  [breakpoints.down('xs')]: {
    padding: getPadding('xs')
  }
});

const getPadding = (bp, multiplier = 1) => (bp === 'sm' ? padding / 2 : bp === 'xs' ? padding / 3 : padding) * multiplier;

const useStyles = makeStyles(({ breakpoints, palette, spacing, layout }: any) =>
  createStyles({
    header: {
      background: palette.primary.light,
      color: palette.common.white,
      fontWeight: 900,
      ...getMobilePadding(breakpoints)
    },
    primaryText: {
      fontSize: 30,
      fontWeight: 900,
      color: palette.primary.dark
    }
  })
);

export default function SearchHeaderRedux({ title = 'App Library' }) {
  const [{ searchtext, filters }, setValues] = useTableValues('Applications');

  const classes = useStyles();
  useFilterList();

  var sm = useFullScreen('sm');

  const handleChange = React.useCallback(
    id => (event: any) => {
      const value = event?.target?.value;
      if (id === 'searchtext') {
        setValues(prev => ({ searchtext: value, filters: prev.filters }));
      } else {
        setValues(prev => ({ searchtext: prev.searchtext, filters: { ...prev.filters, [id]: value } }));
      }
    },
    [setValues]
  );

  return (
    <Grid ref={useHeaderHeightRef()} container className={classes.header}>
      <Grid item xs={12}>
        <Typography variant='h1' className={classes.primaryText}>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container style={{ marginTop: 8 }} alignItems='center' spacing={spacing}>
          <Grid item xs={12} sm style={{ marginTop: -4 }}>
            <Grid container spacing={spacing}>
              <Grid item xs>
                <TableSearchV2 value={searchtext} onChange={handleChange('searchtext')} placeholder='Search by name, feature or platform' />
              </Grid>
              <Grid item xs={sm ? 12 : undefined} style={{ minWidth: sm ? undefined : 360 }}>
                <MultiSelectCheck
                  value={filters['Platforms']}
                  onChange={handleChange('Platforms')}
                  placeholder={filters['Platforms']?.length > 0 ? 'Platforms' : 'All Platforms'}
                  InputProps={{ style: { background: 'white' } }}
                  items={Platforms.map(label => ({ value: label, label })) as any}
                  fullWidth={true}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
