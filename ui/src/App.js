import './App.css';
import {Help, Home, Projects, Chat, Clock} from "grommet-icons" ;
import { Anchor, Avatar, Box, Button, Footer, Grid, Grommet, Header, Heading, List, Main, Menu, Nav,
    Paragraph, Sidebar, Stack, Table, TableBody, TableCell, TableHeader,TableRow,  Text, base as baseTheme  } from "grommet"
import { hp } from 'grommet-theme-hp';
import {useState, useEffect} from 'react'
import {getNeeds} from './utils'
import {NeedList} from './NeedList'
import {ProjectList} from './ProjectList'

function App() {

    const [needs, setNeeds] = useState([])
    const [projects, setProjects] = useState([])

    function setNeedListFromChild(needs) {
        setNeeds(needs)
    }

    function setProjectListFromChild(projects) {
        setProjects(projects)
    }

    let claimed_project_heading = "You Have Created A Fork"
    let claimed_project_page = <p>AAAAAAAA</p>

    let the_need_list = <NeedList needs={needs} setNeedListFromChild={setNeedListFromChild}  gotoClaimedProject={gotoClaimedProject} />
    let my_project_list = <ProjectList projects={projects} setProjectListFromChild={setProjectListFromChild}/>

    let my_project_heading = "My Projects"
    let current_needs_heading = "Current Needs"

    const [the_list, setTheList] = useState(the_need_list)
    const [the_heading, setTheHeading] = useState(current_needs_heading)

    function gotoClaimedProject(original_owner, project, inviteLink) {
        console.log("gotoClaimedProject("+original_owner+", "+project+", "+inviteLink+")")
        let claimed_project_heading = "You Have Created A Fork Of " + original_owner + "/" + project
        let inv=<a href="+inviteLink+">inviteLink</a>
        let claimed_project_page = <Table>
            <TableHeader>
                <TableRow>
                    <TableCell scope="col" border="bottom">Step</TableCell>
                    <TableCell scope="col" border="bottom">Description</TableCell>
                </TableRow>
            </TableHeader>

            <TableBody>
                <TableRow>
                    <TableCell scope="row">Join Discord</TableCell>
                    <TableCell>Following is an invitation to join the Discord channel on our server dedicated to this project. Please join us by clicking here <a href={inviteLink} >inviteLink</a>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell scope="row">Join the project</TableCell>
                    <TableCell>You will receive an invitation from GitHub to become a contributor on this new repository. Please accept that invite.
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell scope="row">Work the project</TableCell>
                    <TableCell>Once you have accepted the GitHub invitation, you can clone the project and work on it as you would any other GitHub project.
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell scope="row">Commit fixes</TableCell>
                    <TableCell>You can commit freely to the feature branch. When you're ready to publish, create a PR to the develop branch. This will trigger automatic reviews by Arabella staff.
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell scope="row">PR when ready</TableCell>
                    <TableCell>If your PR to develop passes all tests and reviews, an automatic PR to main will be created which will trigger more reviews.
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell scope="row">Merge to main</TableCell>
                    <TableCell>If the merge to main passes, the project will be considered done.
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell scope="row">Success</TableCell>
                    <TableCell>PROFIT!
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>

        setTheList(claimed_project_page)
        setTheHeading(claimed_project_heading)
    }

    function gotoProjectList() {
        setTheList(my_project_list)
        setTheHeading(my_project_heading)
    }

    function gotoNeedList() {
        setTheList(the_need_list)
        setTheHeading(current_needs_heading)
    }

    return (
        <Grommet theme={hp}>
            <Header background="brand">
                <Button icon={<Home/>} hoverIndicator/>
                <Text>Arabella - Using Your Tech Skills To Accelerate OSInt</Text>
                <Menu label="account" items={[{label: 'logout'}]}/>
            </Header>
            <Main pad="none">
                <Grid
                    rows={['large']}
                    columns={['small', 'xlarge']}
                    gap="small"
                    areas={[
                        {name: 'sidebar', start: [0, 0], end: [0, 0]},
                        {name: 'main', start: [1, 0], end: [1, 0]},
                    ]}
                >
                    <Sidebar gridArea="sidebar" background="brand"
                             pad={{left: 'medium', right: 'large', vertical: 'medium'}}
                             header={
                                 <Avatar src="//s.gravatar.com/avatar/87ae97e972bdae9122c58ed4853ff472?s=80"/>
                             }
                             footer={
                                 <Button icon={<Help/>} hoverIndicator/>
                             }>
                        <Nav gap="small">
                            <Button icon={<Projects/>} hoverIndicator label={"Current Needs"} onClick={gotoNeedList}/>
                            <Button icon={<Projects/>} hoverIndicator label={"My Projects"} onClick={gotoProjectList}/>
                            <Button icon={<Clock/>} hoverIndicator/>
                        </Nav>
                    </Sidebar>

                    <Box gridArea="main" background="light-2">
                        <Heading>{the_heading}</Heading>
                        {the_list}
                    </Box>
                </Grid>

            </Main>
            <Footer background="brand" pad="medium">
                <Text>Copyright</Text>
                <Anchor label="About"/>
            </Footer>
        </Grommet>
    );
}

export default App;
