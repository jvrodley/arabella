import {Button, Table, TableBody, TableCell, TableHeader, TableRow} from "grommet";
import {useState} from "react";

function NeedList(props) {

    const [needs, setNeeds] = useState(props.needs)

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

    return (the_need_list)
}

export default NeedList;
