import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Link } from "@mui/material";

//to do add datasource here to make rendering much simpler
function createData(
  name: string,
  isActive: boolean,
  createdOn: number,
  createdBy: number,
  customersEnrolled: number,
  type: string,
  dataSource: string
) {
  return {
    name,
    isActive,
    createdOn,
    createdBy,
    customersEnrolled,
    type,
    dataSource,
    audiences: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
    ],
  };
}

function renderCorrectLink(row: ReturnType<typeof createData>) {
  if (row.type == "email") {
    return <Link href={`templates/email/${row.name}`}>{row.name}</Link>;
  } else if (row.type == "sms") {
    return <Link href={`templates/sms/${row.name}`}>{row.name}</Link>;
  } else if (row.type == "slack") {
    return <Link href={`templates/slack/${row.name}`}>{row.name}</Link>;
  } else if (row.dataSource == "people") {
    return <Link href={`person/${row.name}`}>{row.name}</Link>;
  } else {
    return (
      <Link href={`flow/${row.name}${row.isActive ? "/view" : ""}`}>
        {row.name}
      </Link>
    );
  }
}

function renderCorrectColumnNames(data: any) {
  if (data.length < 1) {
    return (
      <>
        <TableCell align="right">Name</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
      </>
    );
  } else if (data[0].hasOwnProperty("isActive")) {
    //this is a test for checking if this is the journeys table or the template table
    return (
      <>
        <TableCell> Name</TableCell>
        <TableCell align="right">Active</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
      </>
    );
  } else if (data[0].dataSource == "people") {
    //this is a test for checking if this is the journeys table or the template table
    return (
      <>
        <TableCell> Id</TableCell>
        <TableCell align="right">Info</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
      </>
    );
  } else {
    return (
      <>
        <TableCell> Name</TableCell>
        <TableCell align="right">Type</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
        <TableCell align="right">&nbsp;</TableCell>
      </>
    );
  }
}

function renderSecondColumn(row: ReturnType<typeof createData>) {
  if (row.dataSource == "people") {
    return (
      <>
        <TableCell align="right">{row.type}</TableCell>
      </>
    );
    //journey vs template
  } else if (row.isActive != null) {
    //this is a test for checking if this is the journeys table or the template table
    return (
      <>
        <TableCell align="right">{String(row.isActive)}</TableCell>
        <TableCell align="right">{row.createdOn}</TableCell>
        <TableCell align="right">{row.createdBy}</TableCell>
      </>
    );
  } else {
    return (
      <>
        <TableCell align="right">{String(row.type)}</TableCell>
        <TableCell align="right">{row.createdOn}</TableCell>
        <TableCell align="right">{row.createdBy}</TableCell>
      </>
    );
  }
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {renderCorrectLink(row)}
        </TableCell>
        {renderSecondColumn(row)}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Audiences
              </Typography>
              {/* <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key="audiences">
                    <TableCell>something</TableCell>
                  </TableRow>
                </TableBody>
              </Table> */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData("Frozen yoghurt", false, 6.0, 24, 4.0, "email", "other"),
  createData("Ice cream sandwich", true, 9.0, 37, 4.3, "slack", "other"),
  createData("Eclair", true, 16.0, 24, 6.0, "email", "other"),
  createData("Cupcake", false, 3.7, 67, 4.3, "email", "other"),
  createData("Gingerbread", true, 16.0, 49, 3.9, "slack", "other"),
];

//example journey template data
//
// [
//   {
//       "id": "6a88b9e2-5b98-4c9c-968e-dfde0163375c",
//       "name": "test",
//       "isActive": false,
//       "audiences": [
//           "31b35cc8-4f9d-468e-8940-6fceab74a8aa",
//           "bc929d7d-949b-448b-aa8b-5c34db96b6e5"
//       ],
//       "rules": [],
//       "visualLayout": {
//           "edges": [],
//           "nodes": [
//               {
//                   "id": "257c4a8f-a66b-4c45-b5b0-88fc6bdef982",
//                   "data": {
//                       "primary": true,
//                       "messages": [],
//                       "triggers": [],
//                       "audienceId": "31b35cc8-4f9d-468e-8940-6fceab74a8aa",
//                       "dataTriggers": []
//                   },
//                   "type": "special",
//                   "width": 350,
//                   "height": 57,
//                   "dragging": false,
//                   "position": {
//                       "x": 181,
//                       "y": 124
//                   },
//                   "selected": false,
//                   "positionAbsolute": {
//                       "x": 181,
//                       "y": 124
//                   }
//               },
//               {
//                   "id": "25a078b2-498f-4ade-a7e9-a2cf6f2e7d9f",
//                   "data": {
//                       "primary": false,
//                       "messages": [],
//                       "triggers": [],
//                       "audienceId": "bc929d7d-949b-448b-aa8b-5c34db96b6e5",
//                       "dataTriggers": []
//                   },
//                   "type": "special",
//                   "width": 350,
//                   "height": 57,
//                   "dragging": false,
//                   "position": {
//                       "x": 124,
//                       "y": 296
//                   },
//                   "selected": true,
//                   "positionAbsolute": {
//                       "x": 124,
//                       "y": 296
//                   }
//               }
//           ]
//       }
//   },
//   {
//       "id": "8b7233bd-70ea-4e8e-a695-cbeff2ad1c6a",
//       "name": "test2",
//       "isActive": false,
//       "audiences": [
//           "6e81b696-3b58-4826-92dd-3a3392ea42ec",
//           "880293f6-9963-4606-a0eb-61128f494dc2"
//       ],
//       "rules": [],
//       "visualLayout": {
//           "edges": [],
//           "nodes": [
//               {
//                   "id": "b3196e82-f8a6-45d8-80aa-397fd3242ec5",
//                   "data": {
//                       "primary": true,
//                       "messages": [],
//                       "triggers": [],
//                       "audienceId": "6e81b696-3b58-4826-92dd-3a3392ea42ec",
//                       "dataTriggers": []
//                   },
//                   "type": "special",
//                   "width": 350,
//                   "height": 57,
//                   "dragging": false,
//                   "position": {
//                       "x": 232,
//                       "y": 153
//                   },
//                   "selected": false,
//                   "positionAbsolute": {
//                       "x": 232,
//                       "y": 153
//                   }
//               },
//               {
//                   "id": "34638597-6104-4879-860b-fb62939e2749",
//                   "data": {
//                       "primary": false,
//                       "messages": [],
//                       "triggers": [],
//                       "audienceId": "880293f6-9963-4606-a0eb-61128f494dc2",
//                       "dataTriggers": []
//                   },
//                   "type": "special",
//                   "width": 350,
//                   "height": 57,
//                   "dragging": false,
//                   "position": {
//                       "x": 191,
//                       "y": 276
//                   },
//                   "selected": true,
//                   "positionAbsolute": {
//                       "x": 191,
//                       "y": 276
//                   }
//               }
//           ]
//       }
//   }
// ]

// Example template data:
// [
//   {
//       "id": 1,
//       "name": "q",
//       "text": null,
//       "subject": null,
//       "slackMessage": "fd",
//       "type": "slack"
//   },
//   {
//       "id": 2,
//       "name": "w",
//       "text": null,
//       "subject": null,
//       "slackMessage": "fd",
//       "type": "slack"
//   }
// ]

// to do
// this function takes in the data, figures out is it journey, template or people, sets datasource to that
// then all other rendering is simple
function transformJourneyData(data: any) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    //people table
    // if (data[0].hasOwnProperty("salient")) {
    //   result.push({
    //     name: data[i].id,
    //     isActive: null,
    //     type: null,
    //     createdOn: null,
    //     createdBy: data[i].salient,
    //     customersEnrolled: null,
    //     audiences: null,
    //     dataSource: "people",
    //   });
    // } else {
    //   // journey or templates
    //   result.push({
    //     name: data[i].name,
    //     isActive: data[i].isActive,
    //     type: data[i].type,
    //     createdOn: data[i].createdOn,
    //     createdBy: data[i].createdBy,
    //     customersEnrolled: data[i].customersEnrolled,
    //     audiences: data[i].audiences,
    //     datasource: (data[0].hasOwnProperty("salient")? "people" :),
    //   });
    // }
    result.push({
      name: data[i].hasOwnProperty("salient") ? data[i].id : data[i].name,
      isActive: data[i].isActive,
      type: data[i].hasOwnProperty("salient") ? data[i].salient : data[i].type,
      createdOn: data[i].createdOn,
      createdBy: data[i].createdBy,
      customersEnrolled: data[i].customersEnrolled,
      audiences: data[i].audiences,
      dataSource: data[i].hasOwnProperty("salient") ? "people" : "j",
    });
  }
  return result;
}

//const

export default function TableTemplate({ data }: any) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {renderCorrectColumnNames(data)}
          </TableRow>
        </TableHead>
        <TableBody>
          {transformJourneyData(data).map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

//export default TableTemplate;
