// import React from 'react';
// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"; // Assuming shadcn components are here
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import Link from 'next/link';
// import { DataTable, DataTableCell } from '@microfox/types';

// const renderCell = (cell: DataTableCell) => {
//     switch (cell.type) {
//         case 'text':
//             return <span>{cell.value}</span>;
//         case 'button':
//             return <Button variant={cell.variant}>{cell.label}</Button>;
//         case 'badge':
//             return <Badge variant={cell.variant}>{cell.label}</Badge>;
//         case 'link':
//             return <Link href={cell.href} target={cell.target}>{cell.text}</Link>;
//         case 'image':
//             return <img src={cell.src} alt={cell.alt} width={cell.width} height={cell.height} />;
//         default:
//             // Exhaustive check
//             const exhaustiveCheck: never = cell;
//             return null;
//     }
// };

// export const ShadcnDataTable: React.FC<{ data: DataTable }> = ({ data }) => {
//     return (
//         <Table>
//             {data.caption && <TableCaption>{data.caption}</TableCaption>}
//             {data.headers && (
//                 <TableHeader>
//                     <TableRow>
//                         {data.headers.map((header, index) => (
//                             <TableHead key={index}>{header}</TableHead>
//                         ))}
//                     </TableRow>
//                 </TableHeader>
//             )}
//             <TableBody>
//                 {data.rows.map((row, rowIndex) => (
//                     <TableRow key={rowIndex}>
//                         {row.map((cell, cellIndex) => (
//                             <TableCell key={cellIndex}>{renderCell(cell)}</TableCell>
//                         ))}
//                     </TableRow>
//                 ))}
//             </TableBody>
//         </Table>
//     );
// };

// // Example usage
// const exampleData: DataTable = {
//     caption: "Recent Invoices",
//     headers: ["Invoice", "Status", "Method", "Amount", "Action"],
//     rows: [
//         [
//             { type: "text", value: "INV001" },
//             { type: "badge", label: "Paid", variant: "default" },
//             { type: "text", value: "Credit Card" },
//             { type: "text", value: "$250.00" },
//             { type: "button", label: "View", variant: "outline" }
//         ],
//         [
//             { type: "text", value: "INV002" },
//             { type: "badge", label: "Pending", variant: "secondary" },
//             { type: "text", value: "PayPal" },
//             { type: "text", value: "$150.00" },
//             { type: "link", href: "/invoices/INV002", text: "Details" }
//         ],
//     ],
// };

// export const ExampleComponent = () => (
//     <div>
//         <h1>Example Shadcn Table</h1>
//         <ShadcnDataTable data={exampleData} />
//     </div>
// ); 