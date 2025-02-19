import * as React from 'react';
import { Grid, Typography, createStyles, makeStyles, Chip } from '@material-ui/core';
import { useFullScreen } from '../../hooks';
import useFilterList from '../../database/useFilterList';
import TableSearchV2 from '../application/GenericTable/TableSearchV2';
import MultiSelectCheck from '../application/DialogField/MultiSelectCheck';
import { Platforms, withReplacement } from '../../database/models/Application';
import { useTableFilterValues, useTableValues } from '../application/GenericTable/store';
import { useHeaderHeightRef } from '../layout/hooks';
import DialogButton from '../application/GenericDialog/DialogButton';
import ViewModeButtons from '../application/GenericTable/Applications/ViewModeButtons';
import { categories } from '../../constants';

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

const useStyles = makeStyles(({ breakpoints, palette }: any) =>
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
    },
    deleteIcon: {
      color: 'white !important'
    }
  })
);

export default function SearchHeaderRedux({ title = 'App Library' }) {
  const [{ searchtext, filters = {} }, setValues] = useTableValues('Applications');
  const [, setFilterValues] = useTableFilterValues('Applications');

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

  const items = Object.keys(filters)
    .filter(k => k !== 'Platforms' && k !== 'SavedFilter')
    .map(k => ({ key: k, label: filters[k].name, value: filters[k] }));

  const handleDelete = React.useCallback(
    (key, value) => event => {
      setValues(prev => {
        return { searchtext: prev.searchtext, filters: { ...prev.filters, [key]: (prev?.filters[key] ?? []).filter(v => v !== value) } };
      });
    },
    [setValues]
  );

  const handleReset = React.useCallback(() => setFilterValues({}), [setFilterValues]);

  let showClear = false;

  return (
    <Grid ref={useHeaderHeightRef()} container className={classes.header}>
      <Grid item xs={12}>
        <Grid container justify='space-between' alignItems='flex-end'>
          <Grid>
            <Typography variant='h1' className={classes.primaryText}>
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <ViewModeButtons />
          </Grid>
        </Grid>
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
      <Grid item xs={12}>
        <Grid container justify='space-between' alignItems='center'>
          <Grid item xs>
            <Grid container alignItems='center' spacing={1} style={{ marginTop: 8 }}>
              {items.map((item, i) => {
                const category = categories[item.key];
                if (item.value.length > 0) {
                  showClear = true;
                }
                return !Array.isArray(item?.value) ? (
                  <></>
                ) : (
                  item.value.map((label, i2) => (
                    <Grid item>
                      <Chip
                        key={`${label}-${i}-${i2}`}
                        style={{ background: category?.color, color: 'white', marginRight: 8 }}
                        variant='outlined'
                        size='small'
                        label={withReplacement(label)}
                        onDelete={handleDelete(item.key, label)}
                        classes={{
                          deleteIcon: classes.deleteIcon
                        }}
                      />
                    </Grid>
                  ))
                );
              })}
              {showClear && (
                <Grid item>
                  <DialogButton variant='link' color='textSecondary' underline='always' tooltip='Click to reset all filters' onClick={handleReset}>
                    Reset all filters
                  </DialogButton>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
