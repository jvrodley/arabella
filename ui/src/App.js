import './App.css';
import {Help, Home, Projects, Chat, Clock} from "grommet-icons" ;
import { Anchor, Avatar, Box, Button, Footer, Grid, Grommet, Header, Heading, List, Main, Menu, Nav,
    Paragraph, Sidebar, Stack, Table, TableBody, TableCell, TableHeader,TableRow,  Text, base as baseTheme  } from "grommet"
import { hp } from 'grommet-theme-hp';
import {useState} from 'react'

function App() {

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
            <TableRow>
                <TableCell scope="row">
                    <strong>Datalux/Osintgram</strong>
                    <br />Osintgram is a OSINT tool on Instagram to collect, analyze, and run reconnaissance.</TableCell>
                <TableCell>Work with Python 3.9 on Windows 7</TableCell>
                <TableCell>Python, Makefile, Dockerfile</TableCell>
                <TableCell><Button label={"Claim"} /> </TableCell>
            </TableRow>
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
                    <strong>s0md3v/Photon</strong>
                    <br />Incredibly fast crawler designed for OSINT.</TableCell>
                <TableCell>Broken - needs to work with Python 3.7 on Mac</TableCell>
                <TableCell>Python, Dockerfile</TableCell>
            </TableRow>
            <TableRow>
                <TableCell scope="row">
                    <strong>DedSecInside/TorBot</strong>
                    <br />Dark Web OSINT Tool</TableCell>
                <TableCell>Broken - won't build/run in Debian, Mac or Windows</TableCell>
                <TableCell>Python, Shell, Dockerfile</TableCell>
            </TableRow>
            <TableRow>
                <TableCell scope="row">
                    <strong>m4ll0k/Infoga</strong>
                <br />Infoga - Email OSINT</TableCell>
                <TableCell>Work with Python 3.9 on Windows 7</TableCell>
                <TableCell>Python, Dockerfile</TableCell>
            </TableRow>
            <TableRow>
                <TableCell scope="row">
                    <strong>sc1341/InstagramOSINT</strong>
                    <br />An Instagram Open Source Intelligence Tool</TableCell>
                <TableCell>Work with Python 3.9 on Windows 7</TableCell>
                <TableCell>Python</TableCell>
            </TableRow>
            <TableRow>
                <TableCell scope="row">
                    <strong>SharadKumar97/OSINT-SPY</strong>
                 Performs OSINT scan on email/domain/ip_address/organization using OSINT-SPY. It can be used by Data Miners, Infosec R</TableCell>
                <TableCell>Work with Python 3.9 on Windows 7</TableCell>
                <TableCell>Python</TableCell>
            </TableRow>
            <TableRow>
                <TableCell scope="row">
                    <strong>kennbroorg/iKy</strong>
                OSINT Project</TableCell>
                <TableCell>Work with Python 3.9 on Windows 7</TableCell>
                <TableCell>Python</TableCell>
            </TableRow>
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
