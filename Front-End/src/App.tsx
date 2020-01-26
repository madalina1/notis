import React from 'react';
import { Switch } from 'react-router-dom';
import { routes } from './modules/routes/routes';
import { RouteWithSubRoutes } from './modules/routes/RouteConfig';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import './assets/styles/_base.scss';
import { Drawer, Divider, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import { MdGTranslate } from "react-icons/md";
import StyledTreeItem from './shared/StyledTreeItem/StyledTreeItem';
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { FiFilter } from "react-icons/fi";

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
				<TreeView
					className={classes.root}
					defaultExpanded={['3']}
					defaultCollapseIcon={<IoIosArrowDown />}
					defaultExpandIcon={<IoIosArrowForward />}
					defaultEndIcon={<div style={{ width: 24 }} />}
				>
					<StyledTreeItem nodeId="3" labelText="Categories" labelIcon={FiFilter}>
						<StyledTreeItem
							nodeId="5"
							labelText="Social"
							labelIcon={FiFilter}
							labelInfo="90"
							color="#1a73e8"
							bgColor="#e8f0fe"
						/>
						<StyledTreeItem
							nodeId="6"
							labelText="Updates"
							labelIcon={FiFilter}
							labelInfo="2,294"
							color="#e3742f"
							bgColor="#fcefe3"
						/>
					</StyledTreeItem>
				</TreeView>
				<Divider />
				<List>
					{['See all notaries', 'See all translators'].map((text, index) => (
						<ListItem button key={text}>
							<ListItemIcon>{index === 0 ? <FaEnvelopeOpenText /> : <MdGTranslate />}</ListItemIcon>
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
