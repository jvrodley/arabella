import {Button, Table, TableBody, TableCell, TableHeader, TableRow} from "grommet";
import {useEffect, useState} from "react";
import {getNeeds, claimAndFork} from "./utils";

export function NeedList(props) {

    console.log("NeedList rerendering with props.need set to " + JSON.stringify(props.needs))
    const [needs, setNeeds] = useState(props.needs)


    useEffect(() => {
        const fetchData = async () => {
            console.log("useEffect fetchData")
            let x = await getNeeds('arabella.rodley.com', 3000)
            console.log("rendering useEffect setting needs " + JSON.stringify(x))
            setNeeds(JSON.parse(JSON.stringify(x)))
            props.setNeedListFromChild(JSON.parse(JSON.stringify(x)))
        }
        fetchData();
    }, [])  // eslint-disable-line react-hooks/exhaustive-deps


    function claimRow(row, ev) {
        console.log("Claiming row " +JSON.stringify(row))
        const fetchData = async () => {
            console.log("claimRow fetchData")
            let x = await claimAndFork('arabella.rodley.com', 3000, row.owner, row.project, row.needid)
            console.log("rendering useEffect setting needs " + JSON.stringify(x))
        }
        fetchData();

    }

    function getNeedRow(row, index, arr) {
        return <TableRow>
            <TableCell scope="row">
                <strong><a href={row.original_github_url} target={"_blank"} >{row.original_github_owner}/{row.project}</a></strong>
                <br />{row.original_github_description}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>{row.languages}</TableCell>
            <TableCell><Button label={"Claim"} onClick={(e) => claimRow(row, e)} /></TableCell>
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

    return (the_need_list)
}

export default NeedList;
