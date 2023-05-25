import { ipdata } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function IndexPage({
  params: { ip },
}: {
  params: { ip: string }
}) {
  const data = await ipdata(ip)
  if (data.code !== 0) {
    return "Enter Your IP Address"
  } else {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Country Name</TableCell>
            <TableCell>{data.data.country_name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Region Name</TableCell>
            <TableCell>{data.data.region_name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>City Name</TableCell>
            <TableCell>{data.data.city_name}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Owner Domain</TableCell>
            <TableCell>{data.data.owner_domain}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ISP Domain</TableCell>
            <TableCell>{data.data.isp_domain}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>IP</TableCell>
            <TableCell>{data.data.ip}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bitmask</TableCell>
            <TableCell>{data.data.bitmask}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }
}
