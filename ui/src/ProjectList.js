import {Button, Table, TableBody, TableCell, TableHeader, TableRow} from "grommet";
import {useEffect, useState} from "react";
import {getNeeds} from "./utils";

export function ProjectList(props) {

    const [projects, setProjects] = useState(props.projects)

    useEffect(() => {
        const fetchData = async () => {
            console.log("useEffect fetchData")
            let x = await getProjects('arabella.rodley.com', 3000, 1)
            console.log("rendering useEffect setting projects " + JSON.stringify(x))
            setNeeds(JSON.parse(JSON.stringify(x)))
            props.setProjectListFromChild(JSON.parse(JSON.stringify(x)))
        }
        fetchData();
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps

    function getProjectRow(row, index, arr) {
        return <TableRow>
            <TableCell scope="row">
                <strong><a href={row.forked_github_url}
                           target={"_blank"}>{row.forked_github_owner}/{row.project}</a></strong>
                <br/>{row.original_github_description}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell><a href={row.invite_link} target={"_blank"} >Discord discussion</a></TableCell>
        </TableRow>
    }


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
            {projects.map(getProjectRow)}
        </TableBody>
    </Table>

    return (project_list)

}

export default ProjectList;
