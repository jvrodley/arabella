import {Button, Table, TableBody, TableCell, TableHeader, TableRow} from "grommet";
import {useState} from "react";

export function ProjectList(props) {

    const [projects, setProjects] = useState(props.projects)
    let project_list = <Table>
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
                    <br/>theHarvester is a simple to use, yet powerful tool designed to be used during the
                    reconnaissance stage of a red
                    team assessment or penetration test.</TableCell>
                <TableCell>Needs a Windows UI that limits arguments to small subset - see Discord discussion</TableCell>
                <TableCell>Python, Dockerfile</TableCell>
            </TableRow>
            <TableRow>
                <TableCell scope="row">
                    <strong>Datalux/Osintgram</strong>
                    <br/>Osintgram is a OSINT tool on Instagram to collect, analyze, and run reconnaissance.</TableCell>
                <TableCell>Work with Python 3.9 on Windows 7</TableCell>
                <TableCell>Python, Makefile, Dockerfile</TableCell>
            </TableRow>
        </TableBody>
    </Table>

    return (project_list)

}

export default ProjectList;
