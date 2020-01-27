import React, { Fragment } from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { Marker } from '@react-google-maps/api';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './Marker.scss';
import Rating from '@material-ui/lab/Rating';

import { MdLanguage, MdSettingsPhone, MdShare } from "react-icons/md";
import { AiOutlineSchedule } from "react-icons/ai";
import { FaRegAddressCard, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const useStyles = makeStyles({
  list: {
    width: 350,
  },
  fullList: {
    width: 'auto',
  },
});

const CustomMarker = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const classes = useStyles();
  const [value, setValue] = React.useState<number | null>(2);

  const [state, setState] = React.useState({
    right: false
  });

  type DrawerSide = 'right';

  const toggleDrawer = (side: DrawerSide, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = (side: DrawerSide) => (
    <div
      className={classes.list}
      role="presentation"
      onKeyDown={toggleDrawer(side, false)}
    >
      <div className="marker-title">
        <h2>{props.title}</h2>
        <h4>{props.name}</h4>
      </div>
      <List>
        <ListItem key="Languages" className="list-items">
          <ListItemIcon className="list-icon">{<MdLanguage />}</ListItemIcon>
          <ListItemText primary={<div className="list-items-text"><h5>Languages</h5><h5>{props.languages.join(", ")}</h5></div>} />
        </ListItem>
        <ListItem key="Phone Number" className="list-items">
          <ListItemIcon className="list-icon">{<MdSettingsPhone />}</ListItemIcon>
          <ListItemText primary={<div className="list-items-text"><h5>Phone Number</h5><h5 style={{ marginRight: '34px' }}>{props.phoneNumber}</h5></div>} />
        </ListItem>
        <ListItem key="Schedule" className="list-items">
          <ListItemIcon className="list-icon">{<AiOutlineSchedule />}</ListItemIcon>
          <ListItemText primary={<div className="list-items-text">
            <h5 style={{ display: 'flex', alignItems: 'center' }}>Schedule</h5>
            <div style={{ marginRight: '-2px' }}>
              {
                Object.keys(props.schedule).map((element: any, key: any) => <h5 className="schedule" key={key}><b>{element}</b>: {props.schedule[element].startH} - {props.schedule[element].endH}</h5>)
              }
            </div>
          </div>} />
        </ListItem>
        <ListItem key="Address" className="list-items">
          <ListItemIcon className="list-icon">{<FaRegAddressCard />}</ListItemIcon>
          <ListItemText primary={<div className="list-items-text"><h5>Address</h5><h5>{Object.values(props.address).join(", ")}</h5></div>} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <div className="rating-container">
          <Typography className="rating-text">Give a rating: </Typography>
          <Rating
            name="simple-controlled"
            value={value}
            style={{marginRight: '8px'}}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </div>
        <ListItem key="Share" className="list-items">
          <ListItemIcon className="list-icon">{<MdShare />}</ListItemIcon>
          <ListItemText primary={<div className="list-items-text"><h5>Share on</h5></div>} />
        </ListItem>
        <ListItem key="Socials" className="list-items">
          <Fab color="primary" aria-label="add" className="icon-style">
            <FaFacebookF />
          </Fab>
          <Fab color="secondary" aria-label="add" className="icon-style">
            <FaInstagram />
          </Fab>
          <Fab color="primary" aria-label="add" className="icon-style twitter">
            <FaTwitter />
          </Fab>
        </ListItem>
      </List>
    </div>
  );

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return <Fragment>
    <Marker
      position={props.position}
      onClick={toggleDrawer('right', true)}
      onMouseOver={handlePopoverOpen}
      onMouseOut={handlePopoverClose}
      aria-describedby={id}
    />
    <Drawer anchor="right" open={state.right} onClose={toggleDrawer('right', false)}>
      {sideList('right')}
    </Drawer>
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Typography>{props.text}hahaha</Typography>
    </Popover>
  </Fragment>
}

export default CustomMarker;