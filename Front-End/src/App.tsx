import React from 'react';
import { Switch } from 'react-router-dom';
import { routes } from './modules/routes/routes';
import { RouteWithSubRoutes } from './modules/routes/RouteConfig';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import './assets/styles/_base.scss';
import { Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Typography, Checkbox, FormControlLabel } from '@material-ui/core';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import { MdGTranslate } from "react-icons/md";
import { FiFilter } from "react-icons/fi";
import logo from './assets/images/icon.png';

const drawerWidth = 280;

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

	const [state, setState] = React.useState({
		foreignCitizen: false,
		data: null
	});

	const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, [name]: event.target.checked });
	};

	const fetchNotaries = () => (event: any) => {
		fetch('https://jsonplaceholder.typicode.com/todos/1')
			.then(response => response.json())
			.then((data: any) => setState({ ...state, data }));
	}

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
				<img src={logo} width="150px" height="auto" alt="icon" className="logo" />
				<Divider />
				<List className="menu-container">
					<ListItem key="Filter by" className="menu-element">
						<ListItemIcon className="menu-icon">{<FiFilter />}</ListItemIcon>
						<ListItemText primary={<Typography style={{ fontWeight: 'bold' }}>Filter by</Typography>} className='menu-filter' />
					</ListItem>
					<ListItem key="Price" className="menu-element">
						<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}><div>Price</div>

						</div>} className='menu-filter-element' />
					</ListItem>
					<ListItem key="Foreign Citizen" className="menu-element">
						<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}><div>Foreign Citizen</div>
							<FormControlLabel
								control={
									<Checkbox
										checked={state.foreignCitizen}
										onChange={handleChange('foreignCitizen')}
										value="foreignCitizen"
										color="primary"
									/>
								}
								label=""
							/>
						</div>} className='menu-filter-element' />
					</ListItem>
				</List>
				<Divider />
				<List>
					<ListItem button key='See all notaries'>
						<ListItemIcon className="menu-icon">{<FaEnvelopeOpenText />}</ListItemIcon>
						<ListItemText primary='See all notaries' onClick={fetchNotaries()} />
					</ListItem>
					<ListItem button key='See all translators'>
						<ListItemIcon className="menu-icon">{<MdGTranslate />}</ListItemIcon>
						<ListItemText primary='See all translators' />
					</ListItem>
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
