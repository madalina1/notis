import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import './assets/styles/_base.scss';
import { Drawer, Divider, Input, List, ListItem, ListItemIcon, ListItemText, Typography, Checkbox, FormControlLabel, MenuItem, Select, Button, RadioGroup, Radio } from '@material-ui/core';
import { FiFilter } from "react-icons/fi";
import logo from './assets/images/icon.png';
import Home from './modules';
import { BaseFetch } from './services';
import { IService, INotary } from './models';

interface IState {
	firstLoad: boolean;
	foreignCitizen: boolean,
	data: any,
	city: string,
	minPrice: number,
	maxPrice: number,
	typeOfService: string,
	startH: number,
	endH: number,
	days: string[],
	services: IService[]
}

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

	const [state, setState]: [IState, any] = React.useState({
		firstLoad: false,
		foreignCitizen: false,
		data: null,
		city: "Iasi",
		minPrice: 0,
		maxPrice: 0,
		typeOfService: '',
		startH: 7,
		endH: 0,
		days: [],
		services: []
	});

	const [value, setValue]: ['allNotaries' | 'allTranslators', any] = React.useState('allNotaries');

	const getAllServices = (queryParamValue: string): void => {
		BaseFetch('services', [{
			key: 'officeType',
			value: queryParamValue
		}])
			.then((services: IService[]) => setState({ ...state, services }));
	}

	const getTypeOfService = () => {
		if (value === 'allNotaries') {
			getData('translators');
			getAllServices('translation');
		} else {
			getData('notaries');
			getAllServices('notary');
		}
	}

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value);
		getTypeOfService();
	};

	const handleChangeSelect = (name: string) => (event: React.ChangeEvent<{ value: any }>) => {
		setState({ ...state, [name]: event.target.value });
	};

	const handleChangeBool = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, [name]: event.target.checked });
	};

	const handleChangeInput = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, [name]: Number(event.target.value) });
	};

	const firstLoad = (): void => {
		if (!state.firstLoad) {
			state.firstLoad = true;
			getData('notaries');
			getAllServices('notary');
		}
	}

	const getData = (type: 'notaries' | 'translators'): void => {
		BaseFetch(type).then((data: INotary[]) => setState({ ...state, data }));
	}

	const getFilteredData = (event: any): void => {
		const endpoint: string = value === 'allNotaries' ? 'notaries' : 'translators';
		BaseFetch(`${endpoint}/filters`, [
			{
				key: 'city',
				value: state.city
			}, {
				key: 'typeOfService',
				value: state.typeOfService
			}, {
				key: 'minPrice',
				value: state.minPrice
			}, {
				key: 'maxPrice',
				value: state.maxPrice
			}, {
				key: 'isSupportedForeignCitizens',
				value: state.foreignCitizen ? 1 : 0
			}, {
				key: 'startH',
				value: state.startH
			}, {
				key: 'endH',
				value: state.endH
			}, {
				key: 'days',
				value: state.days.join(',')
			}
		])
			.then((data: any) => setState({ ...state, data }))
	}

	return (
		<div className={classes.root}>
			{firstLoad()}
			<Drawer
				className={classes.drawer}
				variant="permanent"
				classes={{
					paper: classes.drawerPaper,
				}}
				anchor="left">
				<img src={logo} width="150px" height="auto" alt="icon" className="logo" />
				<Divider />
				<List style={{ marginLeft: '16px' }}>
					<RadioGroup aria-label="filters" name="filters" value={value} onChange={handleChange} row>
						<FormControlLabel value="allNotaries" control={<Radio />} label="See all notaries" />
						<FormControlLabel value="allTranslators" control={<Radio />} label="See all translators" />
					</RadioGroup>
				</List>
				<Divider />
				<List className="menu-container">
					<ListItem key="Filter by" className="menu-element">
						<ListItemIcon className="menu-icon">{<FiFilter />}</ListItemIcon>
						<ListItemText primary={<Typography style={{ fontWeight: 'bold' }}>Filter by</Typography>} className='menu-filter' />
					</ListItem>
					<ListItem key="Min. Price" className="menu-element">
						<ListItemText primary={
							<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
								<div>Min. Price</div>
								<Input
									className="input-style"
									inputProps={{
										min: 0,
										max: state.maxPrice
									}}
									name="minPrice"
									onChange={handleChangeInput('minPrice')}
									type="number"
									value={state.minPrice} />
							</div>
						} className='menu-filter-element' />
					</ListItem>
					<ListItem key="Max. Price" className="menu-element">
						<ListItemText primary={
							<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}>
								<div>Max. Price</div>
								<Input
									className="input-style"
									inputProps={{
										min: state.minPrice
									}}
									name="maxPrice"
									onChange={handleChangeInput('maxPrice')}
									type="number"
									value={state.maxPrice} />
							</div>
						} className='menu-filter-element' />
					</ListItem>
					<ListItem key="City" className="menu-element">
						<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}><div>City</div>
							<Select
								labelId="demo-customized-select-label"
								id="demo-customized-select"
								value={state.city}
								onChange={handleChangeSelect('city')}
								style={{ width: '30%' }}
							>
								{['Iasi', 'Neamt', 'Buzau', 'Suceava', 'Bucuresti', 'Galati', 'Prahova'].map((town: string, index: number) => (
									<MenuItem key={index} value={town}>{town}</MenuItem>
								))}
							</Select>
						</div>} className='menu-filter-element' />
					</ListItem>
					<ListItem key="TypeOfService" className="menu-element">
						<ListItemText primary={
							<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}>
								<div>Type of Service</div>
								<Select
									labelId="demo-customized-select-label"
									id="select-type-of-service"
									value={state.typeOfService}
									onChange={handleChangeSelect('typeOfService')}
									style={{ width: '30%' }}>
									{state.services.map((service: IService) => service.serviceName).map((element: string, index: number) => (<MenuItem key={index} value={element}>{element}</MenuItem>)
									)}
								</Select>
							</div>} className='menu-filter-element' />
					</ListItem>
					<ListItem key="startH" className="menu-element">
						<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}><div>Start Hour</div>
							<Select
								labelId="demo-customized-select-label"
								id="demo-customized-select"
								value={state.startH}
								onChange={handleChangeSelect('startH')}
								style={{ width: '30%' }}
							>
								{Array.from(Array(24).keys()).map((element: number, index: number) => (
									<MenuItem key={index} value={element}>{element}</MenuItem>
								))}
							</Select>
						</div>} className='menu-filter-element' />
					</ListItem>
					<ListItem key="endH" className="menu-element">
						<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}><div>End Hour</div>
							<Select
								labelId="demo-customized-select-label"
								id="demo-customized-select"
								value={state.endH}
								onChange={handleChangeSelect('endH')}
								style={{ width: '30%' }}>
								{Array.from(Array(24).keys()).map((element: number, index: number) => (
									<MenuItem key={index} value={element}>{element}</MenuItem>
								))}
							</Select>
						</div>} className='menu-filter-element' />
					</ListItem>
					<ListItem key="days" className="menu-element">
						<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}><div>Days</div>
							<Select
								labelId="demo-customized-select-label"
								id="demo-customized-select"
								value={state.days as []}
								onChange={handleChangeSelect('days')}
								style={{ width: '30%' }}
								multiple>
								{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((element: string, index: number) => (
									<MenuItem key={index} value={element}>{element}</MenuItem>
								))}
							</Select>
						</div>} className='menu-filter-element' />
					</ListItem>
					{
						value === 'allNotaries' &&
						<ListItem key="Foreign Citizen" className="menu-element">
							<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}><div>Foreign Citizen</div>
								<FormControlLabel
									control={
										<Checkbox
											checked={state.foreignCitizen}
											onChange={handleChangeBool('foreignCitizen')}
											value="foreignCitizen"
											color="primary"
										/>
									}
									label=""
								/>
							</div>} className='menu-filter-element' />
						</ListItem>
					}
				</List>
				<Button variant="outlined" color="secondary" onClick={getFilteredData}>
					Search by filters
      			</Button>
			</Drawer>
			<Switch>
				{/* {routes.map((route, i) => {
					console.log(route);
					return <RouteWithSubRoutes key={i} {...route} />
				})} */}
				<Route exact path="/">
					<Home choice={value === 'allNotaries' ? true : false} data={state.data ? state.data : []} />
				</Route>
			</Switch>
		</div>
	);
}

export default App;
