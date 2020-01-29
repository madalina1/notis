import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import './assets/styles/_base.scss';
import { Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Typography, Checkbox, FormControlLabel, MenuItem, Select, Button, RadioGroup, Radio } from '@material-ui/core';
import { FiFilter } from "react-icons/fi";
import logo from './assets/images/icon.png';
import Home from './modules';

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
		data: null,
		city: "Iasi",
		minPrice: 0,
		maxPrice: 0,
		typeOfService: "",
		startH: 7,
		endH: 0,
		days: []
	});

	const [value, setValue] = React.useState('allNotaries');

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setValue((event.target as HTMLInputElement).value);
	};

	const handleChangeSelect = (name: string) => (event: React.ChangeEvent<{ value: any }>) => {
		setState({ ...state, [name]: event.target.value });
	};

	const handleChangeBool = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, [name]: event.target.checked });
		console.log(state);
	};

	const handleChangeInput = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setState({ ...state, [name]: Number(event.target.value) });
	};

	const sendData = () => (event: any) => {
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
				<List style={{ marginLeft: '16px' }}>
					<RadioGroup aria-label="filters" name="filters" value={value} onChange={handleChange} row>
						<FormControlLabel value="allNotaries" control={<Radio />} label="See all notaries" />
						<FormControlLabel value="allTranslators" control={<Radio />} label="See all translators" />
					</RadioGroup>
				</List>
				<Divider />
				{value === "allNotaries" ?
					<List className="menu-container">
						<ListItem key="Filter by" className="menu-element">
							<ListItemIcon className="menu-icon">{<FiFilter />}</ListItemIcon>
							<ListItemText primary={<Typography style={{ fontWeight: 'bold' }}>Filter by</Typography>} className='menu-filter' />
						</ListItem>
						<ListItem key="Min. Price" className="menu-element">
							<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}><div>Min. Price</div>
								<input type="number" name="minPrice" className="input-style" min="0" value={state.minPrice} onChange={handleChangeInput('minPrice')} />
							</div>} className='menu-filter-element' />
						</ListItem>
						<ListItem key="Max. Price" className="menu-element">
							<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}><div>Max. Price</div>
								<input type="number" name="maxPrice" className="input-style" min="0" value={state.maxPrice} onChange={handleChangeInput('maxPrice')} />
							</div>} className='menu-filter-element' />
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
									<MenuItem value="Iasi">Iasi</MenuItem>
									<MenuItem value="Neamt">Neamt</MenuItem>
									<MenuItem value="Buzau">Buzau</MenuItem>
									<MenuItem value="Suceava">Suceava</MenuItem>
									<MenuItem value="Bucuresti">Bucuresti</MenuItem>
									<MenuItem value="Galati">Galati</MenuItem>
									<MenuItem value="Prahova">Prahova</MenuItem>
								</Select>
							</div>} className='menu-filter-element' />
						</ListItem>
						<ListItem key="TypeOfService" className="menu-element">
							<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}><div>Type of Service</div>
								<Select
									labelId="demo-customized-select-label"
									id="demo-customized-select"
									value={state.typeOfService}
									onChange={handleChangeSelect('typeOfService')}
									style={{ width: '30%' }}
								>
									<MenuItem value="Contracte_de_ipoteca_impobiliara">Contracte de ipoteca imobiliare</MenuItem>
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
									{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(element => <MenuItem value={element}>{element}</MenuItem>)}
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
									style={{ width: '30%' }}
								>
									{Array.from(Array(60).keys()).map(element => <MenuItem value={element}>{element}</MenuItem>)}
								</Select>
							</div>} className='menu-filter-element' />
						</ListItem>
						<ListItem key="days" className="menu-element">
							<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}><div>Days</div>
								<Select
									labelId="demo-customized-select-label"
									id="demo-customized-select"
									value={state.days}
									onChange={handleChangeSelect('days')}
									style={{ width: '30%' }}
									multiple
								>
									{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(element => <MenuItem value={element}>{element}</MenuItem>)}
								</Select>
							</div>} className='menu-filter-element' />
						</ListItem>
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
					</List>
					:
					<List className="menu-container">
						<ListItem key="Filter by" className="menu-element">
							<ListItemIcon className="menu-icon">{<FiFilter />}</ListItemIcon>
							<ListItemText primary={<Typography style={{ fontWeight: 'bold' }}>Filter by</Typography>} className='menu-filter' />
						</ListItem>
						<ListItem key="Min. Price" className="menu-element">
							<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}><div>Min. Price</div>
								<input type="number" name="minPrice" className="input-style" min="0" value={state.minPrice} onChange={handleChangeInput('minPrice')} />
							</div>} className='menu-filter-element' />
						</ListItem>
						<ListItem key="Max. Price" className="menu-element">
							<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}><div>Max. Price</div>
								<input type="number" name="maxPrice" className="input-style" min="0" value={state.maxPrice} onChange={handleChangeInput('maxPrice')} />
							</div>} className='menu-filter-element' />
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
									<MenuItem value="Iasi">Iasi</MenuItem>
									<MenuItem value="Neamt">Neamt</MenuItem>
									<MenuItem value="Buzau">Buzau</MenuItem>
									<MenuItem value="Suceava">Suceava</MenuItem>
									<MenuItem value="Bucuresti">Bucuresti</MenuItem>
									<MenuItem value="Galati">Galati</MenuItem>
									<MenuItem value="Prahova">Prahova</MenuItem>
								</Select>
							</div>} className='menu-filter-element' />
						</ListItem>
						<ListItem key="TypeOfService" className="menu-element">
							<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}><div>Type of Service</div>
								<Select
									labelId="demo-customized-select-label"
									id="demo-customized-select"
									value={state.typeOfService}
									onChange={handleChangeSelect('typeOfService')}
									style={{ width: '30%' }}
								>
									<MenuItem value="Contracte_de_ipoteca_impobiliara">Contracte de ipoteca imobiliare</MenuItem>
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
									{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map(element => <MenuItem value={element}>{element}</MenuItem>)}
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
									style={{ width: '30%' }}
								>
									{Array.from(Array(60).keys()).map(element => <MenuItem value={element}>{element}</MenuItem>)}
								</Select>
							</div>} className='menu-filter-element' />
						</ListItem>
						<ListItem key="days" className="menu-element">
							<ListItemText primary={<div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', paddingTop: '9px' }}><div>Days</div>
								<Select
									labelId="demo-customized-select-label"
									id="demo-customized-select"
									value={state.days}
									onChange={handleChangeSelect('days')}
									style={{ width: '30%' }}
									multiple
								>
									{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(element => <MenuItem value={element}>{element}</MenuItem>)}
								</Select>
							</div>} className='menu-filter-element' />
						</ListItem>
					</List>
				}
				<Button variant="outlined" color="secondary" onClick={sendData}>
					Search by filters
      			</Button>

			</Drawer>
			<Switch>
				{/* {routes.map((route, i) => {
					console.log(route);
					return <RouteWithSubRoutes key={i} {...route} />
				})} */}
				<Route exact path="/">
					<Home choice={value === 'allNotaries' ? true : false} />
				</Route>
			</Switch>
		</div>
	);
}

export default App;
