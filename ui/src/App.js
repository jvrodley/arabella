import './App.css';
import {Help, Home, Projects, Chat, Clock} from "grommet-icons" ;
import { Anchor, Avatar, Box, Button, Footer, Grid, Grommet, Header, Heading, List, Main, Menu, Nav,
    Paragraph, Sidebar, Stack, Table, TableBody, TableCell, TableHeader,TableRow,  Text, base as baseTheme  } from "grommet"
import { hp } from 'grommet-theme-hp';
import {useState, useEffect} from 'react'
import {getNeeds} from 'utils'

function App() {

    const [needs, setNeeds] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            console.log("useEffect fetchData")
            let x = await getNeeds('localhost', 3000)
            log.trace("needs " + JSON.stringify(x))
            setNeeds(x)
        }
        fetchData();
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps


    function claimRow(ev) {
        alert("Claiming row " + JSON.stringify(ev))
    }

    function getNeedRow(row, index, arr) {
        return <TableRow>
            <TableCell scope="row">
                <strong>{row.original_github_url}</strong>
                <br />{row.original_github_description}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>{row.languages}</TableCell>
            <TableCell><Button label={"Claim"} onClick={claimRow}/> </TableCell>
        </TableRow>

    }
    let the_need_list = <Table>
        <TableHeader>
            <TableRow>
                <TableCell scope="col" border="bottom">
                    Project Name/Description
                </TableCell>
                <TableCell scope="col" border="bottom">
                    The Need
                </TableCell>
                <TableCell scope="col" border="bottom">
                    Languages
                </TableCell>
            </TableRow>
        </TableHeader>
        <TableBody>
            {needs.map(getNeedRow)}
        </TableBody>
    </Table>
    let my_project_list = <Table>
        <TableHeader>
            <TableRow>
                <TableCell scope="col" border="bottom">
                    Project Name/Description
                </TableCell>
                <TableCell scope="col" border="bottom">
                    The Need
                </TableCell>
                <TableCell scope="col" border="bottom">
                    Languages
                </TableCell>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell scope="row">
                    <strong>laramies/theHarvester</strong>
                    <br />theHarvester is a simple to use, yet powerful tool designed to be used during the reconnaissance stage of a red
                    team assessment or penetration test.</TableCell>
                <TableCell>Needs a Windows UI that limits arguments to small subset - see Discord discussion</TableCell>
                <TableCell>Python, Dockerfile</TableCell>
            </TableRow>
            <TableRow>
                <TableCell scope="row">
                    <strong>Datalux/Osintgram</strong>
                    <br />Osintgram is a OSINT tool on Instagram to collect, analyze, and run reconnaissance.</TableCell>
                <TableCell>Work with Python 3.9 on Windows 7</TableCell>
                <TableCell>Python, Makefile, Dockerfile</TableCell>
            </TableRow>
        </TableBody>
    </Table>
    let my_project_heading = "My Projects"
    let current_needs_heading = "Current Needs"

    const [the_list, setTheList] = useState(the_need_list)
    const [the_heading, setTheHeading] = useState(current_needs_heading)


    function gotoProjectList() {
            setTheList( my_project_list )
            setTheHeading(my_project_heading)
        }

        function gotoNeedList() {
            setTheList( the_need_list )
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
                    columns={['small', 'large']}
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
