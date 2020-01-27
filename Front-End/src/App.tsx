import React, { Fragment } from 'react';
import { Switch } from 'react-router-dom';
import { routes } from './modules/routes/routes';
import { RouteWithSubRoutes } from './modules/routes/RouteConfig';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import './assets/styles/_base.scss';
import { Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import { MdGTranslate } from "react-icons/md";
import StyledTreeItem from './shared/StyledTreeItem/StyledTreeItem';
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import logo from './assets/images/icon.png';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		drawer: {
			width: drawerWidth,
			flexShrink: 0,
		},
		drawerPaper: {
			width: drawerWidth,
		},
		content: {
			flexGrow: 1,
			backgroundColor: theme.palette.background.default,
			padding: theme.spacing(3),
		},
	})
);

const App: React.FC = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Drawer
				className={classes.drawer}
				variant="permanent"
				classes={{
					paper: classes.drawerPaper,
				}}
				anchor="left"
			>
				<img src={logo} width="150px" height="auto" alt="icon" className="logo"/>
				<Divider />
				<List className="menu-container">
					{['Filter by', 'Price'].map((text, index) => (
						<ListItem key={text} className="menu-element">
							{index === 0 && <ListItemIcon className="menu-icon">{<FiFilter />}</ListItemIcon>}
							<ListItemText primary={index===0 ? <Typography style={{ fontWeight: 'bold' }}>{text}</Typography> : text} className={index === 0 ? 'menu-filter' : 'menu-filter-element'}/>
						</ListItem>
					))}
				</List>
				<Divider />
				<List>
					{['See all notaries', 'See all translators'].map((text, index) => (
						<ListItem button key={text}>
							<ListItemIcon className="menu-icon">{index === 0 ? <FaEnvelopeOpenText /> : <MdGTranslate />}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
			</Drawer>
			<Switch>
				{routes.map((route, i) => (
					<RouteWithSubRoutes key={i} {...route} />
				))}
			</Switch>
		</div>
	);
}

export default App;
